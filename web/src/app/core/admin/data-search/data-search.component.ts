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
import { formatDate } from "@angular/common";
import { DateAxisDataItem } from "@amcharts/amcharts4/charts";

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
  TACData = []
  IMEIData = []
  serialData = []
  rows = []

  dateFromApproveCert
  dateToApproveCert
  dateFromExpiryCert
  dateToExpiryCert
  temp
  temp2 = []
  ApproveDateCert: any | null | undefined = null;
  ExpiryDateSLP;
  ExpiryDateCert2: any | null | undefined = null;


  //Export table
  isSummaryTableHidden: boolean = true
  fileNameRegistration= 'Export_Table_Registration.xlsx'
  fileNameSLPID= 'Export_Table_SLP_ID.xlsx'; 
  fileNameCert = 'Export_Table_Certification.xlsx';

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
      ca_owner: new FormControl(""),
    });

    this.SLPSearchForm = this.formBuilder.group({
      SLP_ID: new FormControl(""),
      SLPID_owner: new FormControl(""),
      principal_certificate: new FormControl(""),
      ApproveDate: new FormControl(""),
      ca_owner: new FormControl(""),
    });

    this.CertificationSearchForm = this.formBuilder.group({
      FileNo: new FormControl(""),
      TAC: new FormControl(""),
      ProductCategory: new FormControl(""),
      Model: new FormControl(""),
      Brand: new FormControl(""),
      ROCROB: new FormControl(""),
      ApproveDate: new FormControl(""),
      ca_owner: new FormControl(""),
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
    );
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

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
      this.RegisterSearchForm.value.ProductRegistrationNo +
      "&CA_owner=" + this.RegisterSearchForm.value.ca_owner
    console.log(datafield);
    this.spinner.show()
    this.productGenerationService.filterMix(datafield).subscribe(
      (res) => {
        this.infoTable = res;
        this.spinner.hide()
        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      },
      (err) => {},
      () => {
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
      this.SLPSearchForm.value.ApproveDate +
      "&CA_owner=" + this.SLPSearchForm.value.ca_owner
    console.log(datafield);
    console.log(this.ExpiryDateSLP);
    this.spinner.show()
    this.SLPService.filterMix(datafield).subscribe(
      (res) => {
        this.SLPTable = res;
        this.spinner.hide()
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
      "&ROCROB=" + this.CertificationSearchForm.value.ROCROB+
      "&CA_owner=" + this.CertificationSearchForm.value.ca_owner
    console.log(this.ExpiryDateCert2);

    this.dateFromApproveCert = this.ApproveDateCert[0]
    this.dateToApproveCert = this.ApproveDateCert[1]

    this.dateFromExpiryCert = this.ExpiryDateCert2[0]
    this.dateToExpiryCert = this.ExpiryDateCert2[1]

    console.log('fromApprove',this.dateFromApproveCert)
    console.log('to',this.dateToApproveCert)

    console.log('fromExpiry',this.dateFromExpiryCert)
    console.log('to',this.dateToExpiryCert)

    this.spinner.show()
    this.productCertificationService.filterMix(datafield).subscribe(
      (res) => {
        this.productCertificationTable = res;
        this.spinner.hide()
        this.productCertificationTable = this.productCertificationTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      },
      (err) => {},
      () => {
        let temp = this.productCertificationTable

            for (let i in temp) {
              if (temp[i].created_date) {
                if (
                  formatDate(temp[i].created_date, "yyyy-MM-dd", "en_US") >=
                    formatDate(this.dateFromApproveCert, "yyyy-MM-dd", "en_US") &&
                  formatDate(temp[i].created_date, "yyyy-MM-dd", "en_US") <=
                    formatDate(this.dateToApproveCert, "yyyy-MM-dd", "en_US")
                ) {
                  console.log('temp2',temp[i])
                  this.temp2.push(temp[i]);
                }
              }
            }
          this.productCertificationTable = this.temp2;
      }
    );
  }

  productGeneration() {
    this.productGenerationService.get().subscribe(
      (res) => {
        this.infoTable = res;
      },
      (err) => {
        console.log("HTTP Error", err)
      },
      () => {
      }
    );
  }

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
      },
      (err) => {},
      () => {
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

    this.productCertificationService.get_TAC().subscribe(
      (res)=>{
        this.TACData = res['TAC_count']

      },
    )

    this.productGenerationService.get_IMEI().subscribe(
      (res)=>{
        this.IMEIData = res['IMEI_count']
      }
    )

    this.productGenerationService.get_serial().subscribe(
      (res)=>{
        this.serialData = res['serial_count']
      }
    )
  }

  SLPGet() {
    this.SLPService.get().subscribe(
      (res) => {
        this.SLPTable = res;

      },
      (err) => {
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => {
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
    let productRegisterationServ = this.productGenerationService;
    this.spinner.show()
    this.dataFromExcelFile.forEach(function (loopval, index) {
      let formDataaaaa: any
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
      productRegisterationServ.post(formDataaaaa[0]).subscribe(
        (res) => {
          console.log("res = ", res);
        },
        (error) => {
          console.error("err", error);
        }
      )
    })
    this.modal.hide();
      setTimeout(() => {
      this.spinner.hide();
    }, 5000);
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
      productCertificertServ.post(formDataaaaa[0]).subscribe(
        (res) => {
          console.log("res = ", res);
        },
        (error) => {
          console.error("err", error);
        }
      );
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

  exportexcel() {
    /* table id is passed over here */   
    let element = document.getElementById('excel-table'); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    console.log("registration",element)
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // /* save to file */
    XLSX.writeFile(wb, this.fileNameRegistration);
  }

  exportexcelCert() {
  /* table id is passed over here */   
  let elementCert = document.getElementById('excel-table-cert'); 
  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(elementCert);
  console.log("export",elementCert)
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // /* save to file */
  XLSX.writeFile(wb, this.fileNameCert);
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
    XLSX.writeFile(wb, this.fileNameSLPID);
  }
}
