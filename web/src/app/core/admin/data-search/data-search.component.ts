import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChild,
  TemplateRef,
  ElementRef,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ProductGenerationService } from "src/app/shared/services/ProductRegistration/ProductGeneration.service";
import * as XLSX from "xlsx";
import Dropzone from "dropzone";
import { BsDatepickerDirective } from "ngx-bootstrap";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { SLPService } from "src/app/shared/services/SLP/SLP.service";
import { productCertificationService } from "src/app/shared/services/productCertification/productCertification.service";
import { NgxSpinnerService } from "ngx-spinner";
import { VisitorCounterService } from 'src/app/shared/services/VisitorCounter/VisitorCounter.service';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: "app-data-search",
  templateUrl: "./data-search.component.html",
  styleUrls: ["./data-search.component.scss"],
})
export class DataSearchComponent implements OnInit, OnDestroy {

  @ViewChild('excel_table_SLP', {static: false}) excel_table_SLP:ElementRef;
  @ViewChild(BsDatepickerDirective, { static: false })
  datepicker: BsDatepickerDirective;
  entries: number = 10;
  infoTable = [];
  IMEITable = [];
  SerialTable = [];
  productCertificationTable = [];
  SLPTable = [];
  VisitorGetTable = [];
  dataSearchForm: FormGroup;
  searchForm: FormGroup;
  addNewDataForm: FormGroup;
  dateSearchForm: FormGroup;
  RegisterSearchForm: FormGroup;
  SLPSearchForm: FormGroup;
  CertificationSearchForm: FormGroup;
  // excel
  dataFromExcelFile = [];
  dataFromExcelFileSLPID = [];
  storeData: any;
  worksheet: any;
  fileUploaded: File;
  jsonData: any;
  data: [][];

  //Export table
  isSummaryTableHidden: boolean = true
  fileName= 'Export_Table.xlsx'; 
  fileNameCert = 'Export_Table_Cert.xlsx';

  private categoryAxis: any;

  tableEntries: number = 5;
  tableSelected: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  SelectionType = SelectionType;

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-lg",
  };

  constructor(
    private productGenerationService: ProductGenerationService,
    private productCertificationService: productCertificationService,
    private SLPService: SLPService,
    private formBuilder: FormBuilder,
    private zone: NgZone,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private VisitorCounterService:VisitorCounterService
  ) {
    this.productGeneration();
    this.productCertificationGet();
    this.SLPGet();
    this.filterIMEI();
    this.filterSerial();
    this.VisitorCounterGet();
  }

  ngOnInit() {
    this.addNewDataForm = this.formBuilder.group({
      Id: new FormControl(""),
      fileNo: new FormControl(""),
      TAC: new FormControl(""),
      productCategory: new FormControl(""),
      modelId: new FormControl(""),
      modelDescription: new FormControl(""),
      consigneeName: new FormControl(""),
      submissionDate: new FormControl(""),
      approveDate: new FormControl(""),
      expiryDate: new FormControl(""),
      category: new FormControl(""),
      imeiNo: new FormControl(""),
      SLPID: new FormControl(""),
      serialNo: new FormControl(""),
    });

    this.RegisterSearchForm = this.formBuilder.group({
      TAC: new FormControl(""),
      imei: new FormControl(""),
      SLPID: new FormControl(""),
      SerialNo: new FormControl(""),
      RegType: new FormControl(""),
      ProductRegistrationNo: new FormControl(""),
    });

    this.SLPSearchForm = this.formBuilder.group({
      SLP_ID: new FormControl(""),
      SLPID_owner: new FormControl(""),
      principal_certificate: new FormControl(""),
      ApproveDate: new FormControl(""),
    });

    this.CertificationSearchForm = this.formBuilder.group({
      FileNo: new FormControl(""),
      TAC: new FormControl(""),
      ProductCategory: new FormControl(""),
      Model: new FormControl(""),
      Brand: new FormControl(""),
      ROCROB: new FormControl(""),
      ApproveDate: new FormControl(""),
    });
  }

  ngOnDestroy() {}

  filterTable() {
    let datafield = "consigneeName=" + this.searchForm.value.brand;
    console.log(datafield);
    this.productGenerationService.filter(datafield).subscribe(
      (res) => {
        this.infoTable = res;
      },
      (err) => {},
      () => console.log("HTTP request completed.")
    );
  }

  // filterDate($event) {
  //   let val = $event.target.value;
  //   let datafield = "approveDate=" + val;
  //   console.log(datafield);
  //   // this.productGenerationService.filterMix(datafield).subscribe(
  //   //   (res) => {
  //   //     this.infoTable=res;
  //   //     console.log("loop ok!!")
  //   //     this.infoTable = this.infoTable.map((prop, key) => {
  //   //       return {
  //   //         ...prop,
  //   //         id: key
  //   //       };
  //   //     });
  //   //     // console.log("xxxxxx = ",this.infoTable)
  //   //   },
  //   //   (err) => {
  //   //     console.log("loop not ok!!")
  //   //     // this.loadingBar.complete();
  //   //     // this.errorMessage();
  //   //     // console.log("HTTP Error", err), this.errorMessage();
  //   //   },
  //   //   () => {
  //   //     console.log("HTTP request completed.")
  //   //   //   this.infoTable = [res]
  //   //   //   console.log("zzzzz = ",this.infoTable)
  //   //   }
  //   // );
  // }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  // filterTableModel($event) {
  //   let val = $event.target.value;
  //   let datafield = "modelId=" + val;
  //   console.log(datafield);
  //   this.productGenerationService.filterMix(datafield).subscribe(
  //     (res) => {
  //       this.infoTable = res;

  //       this.infoTable = this.infoTable.map((prop, key) => {
  //         return {
  //           ...prop,
  //           id: key,
  //         };
  //       });
  //       // console.log("xxxxxx = ",this.infoTable)
  //     },
  //     (err) => {
  //       // this.loadingBar.complete();
  //       // this.errorMessage();
  //       // console.log("HTTP Error", err), this.errorMessage();
  //     },
  //     () => {
  //       console.log("HTTP request completed.");
  //       //   this.infoTable = [res]
  //       //   console.log("zzzzz = ",this.infoTable)
  //     }
  //   );
  // }

  // filterTableImei($event) {
  //   let val = $event.target.value;
  //   let datafield = "imeiNo=" + val;
  //   console.log(datafield);
  //   this.productGenerationService.filterMix(datafield).subscribe(
  //     (res) => {
  //       this.infoTable = res;

  //       this.infoTable = this.infoTable.map((prop, key) => {
  //         return {
  //           ...prop,
  //           id: key,
  //         };
  //       });
  //       // console.log("xxxxxx = ",this.infoTable)
  //     },
  //     (err) => {
  //       // this.loadingBar.complete();
  //       // this.errorMessage();
  //       // console.log("HTTP Error", err), this.errorMessage();
  //     },
  //     () => {
  //       console.log("HTTP request completed.");
  //       //   this.infoTable = [res]
  //       //   console.log("zzzzz = ",this.infoTable)
  //     }
  //   );
  // }

  // filterTableConsignee($event) {
  //   let val = $event.target.value;
  //   let datafield = "consigneeName=" + val;
  //   console.log(datafield);
  //   this.productGenerationService.filterMix(datafield).subscribe(
  //     (res) => {
  //       this.infoTable = res;

  //       this.infoTable = this.infoTable.map((prop, key) => {
  //         return {
  //           ...prop,
  //           id: key,
  //         };
  //       });
  //       // console.log("xxxxxx = ",this.infoTable)
  //     },
  //     (err) => {
  //       // this.loadingBar.complete();
  //       // this.errorMessage();
  //       // console.log("HTTP Error", err), this.errorMessage();
  //     },
  //     () => {
  //       console.log("HTTP request completed.");
  //       //   this.infoTable = [res]
  //       //   console.log("zzzzz = ",this.infoTable)
  //     }
  //   );
  // }

  // filterTableCategory($event) {
  //   console.log("event = ", $event);
  //   let val = $event;
  //   let datafield = "productCategory=" + val;
  //   console.log(datafield);
  //   this.productGenerationService.filterMix(datafield).subscribe(
  //     (res) => {
  //       this.infoTable = res;

  //       this.infoTable = this.infoTable.map((prop, key) => {
  //         return {
  //           ...prop,
  //           id: key,
  //         };
  //       });
  //     },
  //     (err) => {},
  //     () => {
  //       console.log("HTTP request completed.");
  //     }
  //   );
  // }

  // filterTableSerial($event) {
  //   let val = $event.target.value;
  //   let datafield = "serialNo=" + val;
  //   console.log(datafield);
  //   this.productGenerationService.filterMix(datafield).subscribe(
  //     (res) => {
  //       this.infoTable = res;

  //       this.infoTable = this.infoTable.map((prop, key) => {
  //         return {
  //           ...prop,
  //           id: key,
  //         };
  //       });
  //     },
  //     (err) => {},
  //     () => {
  //       console.log("HTTP request completed.");
  //     }
  //   );
  // }

  // filterTableSLPID($event) {
  //   let val = $event.target.value;
  //   let datafield = "SLPID=" + val;
  //   console.log(datafield);
  //   this.productGenerationService.filterMix(datafield).subscribe(
  //     (res) => {
  //       this.infoTable = res;

  //       this.infoTable = this.infoTable.map((prop, key) => {
  //         return {
  //           ...prop,
  //           id: key,
  //         };
  //       });
  //     },
  //     (err) => {},
  //     () => {
  //       console.log("HTTP request completed.");
  //     }
  //   );
  // }

  filterTableRegister() {
    let datafield =
      "TAC=" +
      this.RegisterSearchForm.value.TAC +
      "&IMEI=" +
      this.RegisterSearchForm.value.imei +
      "&RegType=" +
      this.RegisterSearchForm.value.RegType +
      "&SerialNo=" +
      this.RegisterSearchForm.value.SerialNo +
      "&ProductRegistrationNo=" +
      this.RegisterSearchForm.value.ProductRegistrationNo;
    console.log(datafield);
    this.productGenerationService.filterMix(datafield).subscribe(
      (res) => {
        this.infoTable = res;

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      },
      (err) => {},
      () => {
        console.log("HTTP request completed.");
      }
    );
  } 

  filterTableSLP() {
    let datafield =
      "SLP_ID=" +
      this.SLPSearchForm.value.SLP_ID +
      "&SLPID_owner=" +
      this.SLPSearchForm.value.SLPID_owner +
      "&principal_certificate=" +
      this.SLPSearchForm.value.principal_certificate +
      "&ApproveDate=" +
      this.SLPSearchForm.value.ApproveDate;
    console.log(datafield);
    this.SLPService.filterMix(datafield).subscribe(
      (res) => {
        this.SLPTable = res;

        this.SLPTable = this.SLPTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      },
      (err) => {},
      () => {
        console.log("HTTP request completed.");
      }
    );
  }

  filterTableCertication() {
    let datafield =
      "FileNo=" +
      this.CertificationSearchForm.value.FileNo +
      "&TAC=" +
      this.CertificationSearchForm.value.TAC +
      "&ProductCategory=" +
      this.CertificationSearchForm.value.ProductCategory +
      "&Model=" +
      this.CertificationSearchForm.value.Model +
      "&Brand=" + this.CertificationSearchForm.value.Brand +
      "&ApproveDate=" + this.CertificationSearchForm.value.ApproveDate +
      "&ROCROB=" + this.CertificationSearchForm.value.ROCROB;
    console.log(datafield);
    this.productCertificationService.filterMix(datafield).subscribe(
      (res) => {
        this.productCertificationTable = res;

        this.productCertificationTable = this.productCertificationTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      },
      (err) => {},
      () => {
        console.log("HTTP request completed.");
      }
    );
  }

  productGeneration() {
    this.productGenerationService.get().subscribe(
      (res) => {
        this.infoTable = [...res];
        // console.log("zzzzz = ",this.infoTable)
        // let qweqwe = []
        // this.infoTable.forEach( function(data){
        //   console.log('col- - ',data)
        //   qweqwe.push(data)

        // })
        // this.chartDataField = qweqwe
        // console.log('bbbbbbb = ',this.chartDataField)
        // this.calculateCharts()
        console.log(this.infoTable.length);

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
        // console.log("xxxxxx = ",this.infoTable)
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => {
        console.log("HTTP request completed.");
        //   this.infoTable = [res]
        //   console.log("zzzzz = ",this.infoTable)
      }
    );
  }

  // calculateCharts() {
  //   // console.log('infoTable = ',this.infoTable)
  //   this.chartJan = 0
  //   this.chartFeb = 0
  //   this.chartMar = 0
  //   this.chartApr = 0
  //   this.chartMay = 0
  //   this.chartJun = 0
  //   this.chartJul = 0
  //   this.chartAug = 0
  //   this.chartSep = 0
  //   this.chartOct = 0
  //   this.chartNov = 0
  //   this.chartDec = 0
  //   this.infoTable.forEach(
  //     ((row) => {
  //       let checkerDate = moment(row.approveDate).format('MM')
  //       var date = moment('15-06-2010', 'DD-MM-YYYY')
  //       console.log(date.format('MM-DD-YYYY'))
  //       // let checkerDateMonth = checkerDate.month()

  //       console.log("row",row)
  //       console.log('qqqqq - ',new Date(row.approveDate),"--",moment(new Date()).format("MM") );
  //       console.log('row.approveDate = ',row.approveDate)
  //       console.log('checkerDate = ',checkerDate)
  //       // console.log('checkerDateMonth = ',checkerDateMonth)

  //       // if (checkerDateMonth == 0) {
  //       //   this.chartJan += 1
  //       // }
  //       // else if (checkerDateMonth == 1) {
  //       //   this.chartFeb += 1
  //       // }
  //       // else if (checkerDateMonth == 2) {
  //       //   this.chartMar += 1
  //       // }
  //       // else if (checkerDateMonth == 3) {
  //       //   this.chartApr += 1
  //       // }
  //       // else if (checkerDateMonth == 4) {
  //       //   this.chartMay += 1
  //       // }
  //       // else if (checkerDateMonth == 5) {
  //       //   this.chartJun += 1
  //       // }
  //       // else if (checkerDateMonth == 6) {
  //       //   this.chartJul += 1
  //       // }
  //       // else if (checkerDateMonth == 7) {
  //       //   this.chartAug += 1
  //       // }
  //       // else if (checkerDateMonth == 8) {
  //       //   this.chartSep += 1
  //       // }
  //       // else if (checkerDateMonth == 9) {
  //       //   this.chartOct += 1
  //       // }
  //       // else if (checkerDateMonth == 10) {
  //       //   this.chartNov += 1
  //       // }
  //       // else if (checkerDateMonth == 11) {
  //       //   this.chartDec += 1
  //       // }
  //     })
  //   )

  //   this.getPortalChart()
  // }

  // getPortalChart() {
  //   let chart = am4core.create("portalchart", am4charts.XYChart);

  //   // Add data
  //   chart.data = [{
  //     "month": "Jan",
  //     "count": this.chartJan
  //   }, {
  //     "month": "Feb",
  //     "count": this.chartFeb
  //   }, {
  //     "month": "Mar",
  //     "count": this.chartMar
  //   }, {
  //     "month": "Apr",
  //     "count": this.chartApr
  //   }, {
  //     "month": "May",
  //     "count": this.chartMar
  //   }, {
  //     "month": "Jun",
  //     "count": this.chartJun
  //   }, {
  //     "month": "Jul",
  //     "count": this.chartJul
  //   }, {
  //     "month": "Aug",
  //     "count": this.chartAug
  //   }, {
  //     "month": "Sep",
  //     "count": this.chartSep
  //   }, {
  //     "month": "Oct",
  //     "count": this.chartOct
  //   }, {
  //     "month": "Nov",
  //     "count": this.chartNov
  //   }, {
  //     "month": "Dec",
  //     "count": this.chartDec
  //   }
  // ];

  //   // Create axes

  //   let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  //   categoryAxis.dataFields.category = "month";
  //   categoryAxis.renderer.grid.template.location = 0;
  //   categoryAxis.renderer.minGridDistance = 30;

  //   categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
  //     if (target.dataItem && target.dataItem.index && 2 == 2) {
  //       return dy + 25;
  //     }
  //     return dy;
  //   });

  //   let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  //   // Create series
  //   let series = chart.series.push(new am4charts.ColumnSeries());
  //   series.dataFields.valueY = "count";
  //   series.dataFields.categoryX = "month";
  //   series.name = "count";
  //   series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
  //   series.columns.template.fillOpacity = .8;

  //   let columnTemplate = series.columns.template;
  //   columnTemplate.strokeWidth = 2;
  //   columnTemplate.strokeOpacity = 1;

  //   this.chart = chart

  // }

  entryChange($event) {
    this.tableEntries = $event.target.value;
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  NewData() {
    console.log(this.addNewDataForm.value);
    this.productGenerationService.post(this.addNewDataForm.value).subscribe(
      () => {
        // Success
        // this.isLoading = false
        // this.successMessage();
        // this.loadingBar.complete();
        // this.successAlert("create project");
        this.productGeneration();
        console.log("success");
      },
      () => {
        // Failed
        // this.isLoading = false
        // this.successMessage();
        // this.errorAlert("edit");
      },
      () => {
        // After
        // this.notifyService.openToastr("Success", "Welcome back");
        // this.navigateHomePage();
      }
    );
  }

  openModal(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide();
  }

  productCertificationGet() {
    this.productCertificationService.get().subscribe(
      (res) => {
        this.productCertificationTable = res;
        console.log(this.productCertificationTable.length);
      },
      (err) => {},
      () => {
        console.log("HTTP request completed.");
      }
    );
  }

  VisitorCounterGet() {
    this.VisitorCounterService.get().subscribe(
      (res) => {
        this.VisitorGetTable = res;
        console.log("counter visitor",this.VisitorGetTable.length);
      },
      (err) => {},
      () => {
        console.log("HTTP request completed.");
      }
    );
  }

  SLPGet() {
    this.SLPService.get().subscribe(
      (res) => {
        this.SLPTable = res;
        console.log(this.SLPTable.length);
        // this.productCertificationTable = this.productCertificationTable.map((prop, key) => {
        //   return {
        //     ...prop,
        //     id: key
        //   };
        // });
        // console.log("xxxxxx = ",this.infoTable)
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => {
        console.log("HTTP request completed.");
        //   this.infoTable = [res]
        //   console.log("zzzzz = ",this.infoTable)
      }
    );
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.dataFromExcelFile = XLSX.utils.sheet_to_json(ws, { raw: false });
      console.log("this.data = ", this.dataFromExcelFile);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  submitFileExcelRegister() {
    let productCertificertServ = this.productGenerationService;
    this.spinner.show();
    this.dataFromExcelFile.forEach(function (loopval, index) {
      let formDataaaaa: any;
      formDataaaaa = [
        {
          FileNo: loopval.FileNo,
          TAC: loopval.TAC,
          SLPID: loopval.SLPID,
          ProductRegistrationNo: loopval.ProductRegistrationNo,
          RegType: loopval.RegType,
          SerialNo: loopval.SerialNo,
          IMEI: loopval.IMEI,
        },
      ];

      // console.log('loopval.ROCROB = ', loopval)
      console.log("formDataaaaa = ", formDataaaaa[0]);
      // // dalam foreach
      productCertificertServ.post(formDataaaaa[0]).subscribe(
        (res) => {
          console.log("res = ", res);
          this.productGeneration();
          this.modal.hide();
          this.spinner.hide();
        },
        (error) => {
          console.error("err", error);
          this.modal.hide();
          this.spinner.hide();
        }
      );
    });
  }

  submitFileExcelCert() {
    let productCertificertServ = this.productCertificationService;
    this.spinner.show();
    this.dataFromExcelFile.forEach(function (loopval, index) {
      let formDataaaaa: any;
      formDataaaaa = [
        {
          FileNo: loopval.FileNo,
          TAC: loopval.TAC,
          TypeOfProduct: loopval.TypeOfProduct,
          Model: loopval.Model,
          Brand: loopval.Brand,
          MarketingName: loopval.MarketingName,
          ApproveDate: loopval.ApproveDate,
          ExpiryDate: loopval.ExpiryDate,
          ProductCategory: loopval.ProductCategory,
          CertholderName: loopval.CertholderName,
          ROCROB: loopval.ROCROB,
        },
      ];

      // console.log('loopval.ROCROB = ', loopval)
      console.log("formDataaaaa = ", formDataaaaa[0]);

      // dalam foreach
      // productCertificertServ.post(formDataaaaa[0]).subscribe(
      //   (res) => {
      //     console.log("res = ", res);
      //   },
      //   (error) => {
      //     console.error("err", error);
      //   }
      // );
    });
    this.productCertificationGet();
    this.modal.hide();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  submitFileExcelSLPID() {
    let SLPService = this.SLPService;
    this.spinner.show();
    this.dataFromExcelFile.forEach(function (loopval, index) {
      let formDataSLP: any;
      formDataSLP = [
        {
          SLP_ID: loopval.SLPID,
          ExpiryDate: loopval.ExpiryDate,
          ApproveDate: loopval.ApprovedDate,
          SLPID_owner: loopval.SLPIDOwnerInformation,
          principal_certificate: loopval.PrincipalCertificateHolderInformation,
        },
      ];

      // console.log('loopval.ROCROB = ', loopval.SLPID)
      // console.log("formDataaaaa = ", formDataSLP[0]);

      // dalam foreach
      SLPService.post(formDataSLP[0]).subscribe(
        (res) => {
          // console.log("res = ", res);
        },
        (error) => {
          console.error("err", error);
        }
      );
    });
    this.SLPGet();
    this.modal.hide();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  filterIMEI() {
    let datafield = "RegType=IMEI";
    this.productGenerationService.filter(datafield).subscribe(
      (res) => {
        this.IMEITable = res;
        console.log("wewe", this.IMEITable.length);
      },
      (err) => {},
      () => {}
    );
  }

  filterSerial() {
    let datafield = "RegType=SerialNo";
    this.productGenerationService.filter(datafield).subscribe(
      (res) => {
        this.SerialTable = res;
        console.log("wewe", this.SerialTable.length);
      },
      (err) => {},
      () => {}
    );
  }

  exportexcel() {
    /* table id is passed over here */   
    let element = document.getElementById('excel-table'); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    console.log("export",element)
    /* generate workbook and add the worksheet */
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // /* save to file */
    // XLSX.writeFile(wb, this.fileName);
   
 }

 exportexcelCert() {
  /* table id is passed over here */   
  let elementCert = document.getElementById('excel-table-cert'); 
  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(elementCert);
  console.log("export",elementCert)
  /* generate workbook and add the worksheet */
  // const wb: XLSX.WorkBook = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // /* save to file */
  // XLSX.writeFile(wb, this.fileNameCert);
 
}

exportexcelSLP() {
  /* table id is passed over here */   
  let element = document.getElementById('excel_table_SLP'); 
  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
  console.log("export",element)
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  /* save to file */
  XLSX.writeFile(wb, this.fileName);
 
}

// openPDF() {
//   let DATA = document.getElementById('excel_table_SLP');
      
//   html2canvas(DATA).then(canvas => {
      
//       let fileWidth = 208;
//       let fileHeight = canvas.height * fileWidth / canvas.width;
      
//       const FILEURI = canvas.toDataURL('image/png')
//       let PDF = new jsPDF('p', 'mm', 'a4');
//       let position = 0;
//       PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
      
//       PDF.save('angular-demo.pdf');
//   });     
// }
}
