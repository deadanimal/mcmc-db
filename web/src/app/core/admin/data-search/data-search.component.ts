import { forkJoin, Subscription } from "rxjs";
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
  dateFromApproveSLP
  dateToApproveSLP
  dateFromExpirySLP
  dateToExpirySLP
  temp
  temp2 = []
  ApproveDateCert: any | null | undefined = null;
  ApproveDateSLP: any | null | undefined = null;
  ExpiryDateSLP: any | null | undefined = null;
  ExpiryDateCert: any | null | undefined = null;


  //Export table
  isSummaryTableHidden: boolean = true
  fileNameRegistration= 'Export_Table_Registration.xlsx'
  fileNameSLPID= 'Export_Table_SLP_ID.xlsx'; 
  fileNameCert = 'Export_Table_Certification.xlsx';

  private categoryAxis: any;

  tableEntries: number = 5;
  tableEntries2: number = 5;
  tableEntries3: number = 5;
  tableSelected: any[] = [];
  tableSelected2: any[] = [];
  tableSelected3: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  tableActiveRow2: any;
  tableActiveRow3: any;
  SelectionType = SelectionType;

  subscription: Subscription;

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
    this.widgetDataGet();
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
      ExpiryDate: new FormControl(""),
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
      ExpiryDate: new FormControl(""),
      ca_owner: new FormControl(""),
    });

  }

  ngOnDestroy() {}

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
    console.log('ExpiryDateSLP',this.ExpiryDateSLP);
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
        this.SearchDateRangeSLP()
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
        this.SearchDateRangeCert()
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
    this.tableEntries = +$event.target.value;
  }

  entryChange2($event) {
    this.tableEntries2 = +$event.target.value;
  }

  entryChange3($event) {
    this.tableEntries3 = +$event.target.value;
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onSelect2({ selected }) {
    this.tableSelected2.splice(0, this.tableSelected2.length);
    this.tableSelected2.push(...selected);
  }

  onSelect3({ selected }) {
    this.tableSelected3.splice(0, this.tableSelected3.length);
    this.tableSelected3.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  onActivate2(event) {
    this.tableActiveRow2 = event.row;
  }

  onActivate3(event) {
    this.tableActiveRow3 = event.row;
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

  SearchDateRangeCert() {
    if (this.ApproveDateCert != null){
      this.dateFromApproveCert = this.ApproveDateCert[0]
      this.dateToApproveCert = this.ApproveDateCert[1]
      console.log('dateFromApproveCert',this.dateFromApproveCert)
      console.log('dateToApproveCert',this.dateToApproveCert)
      let temp = this.productCertificationTable
      for (let i in temp) {
        if (temp[i].created_date) {
          if (formatDate(temp[i].created_date, "yyyy-MM-dd", "en_US") >=
          formatDate(this.dateFromApproveCert, "yyyy-MM-dd", "en_US") &&
          formatDate(temp[i].created_date, "yyyy-MM-dd", "en_US") <=
          formatDate(this.dateToApproveCert, "yyyy-MM-dd", "en_US")) {
            console.log('temp2',temp[i])
            this.temp2.push(temp[i]);
          }
        }
      }
    }

    if(this.ExpiryDateCert != null){
      this.dateFromExpiryCert = this.ExpiryDateCert[0]
      this.dateToExpiryCert = this.ExpiryDateCert[1]
      console.log('dateFromApproveCert',this.dateFromExpiryCert)
      console.log('dateToApproveCert',this.dateToExpiryCert)

      let temp3 = this.productCertificationTable
      for (let i in temp3) {
        if (temp3[i].created_date) {
          if (formatDate(temp3[i].created_date, "yyyy-MM-dd", "en_US") >=
          formatDate(this.dateFromExpiryCert, "yyyy-MM-dd", "en_US") &&
          formatDate(temp3[i].created_date, "yyyy-MM-dd", "en_US") <=
          formatDate(this.dateToExpiryCert, "yyyy-MM-dd", "en_US")) {
            console.log('temp3',temp3[i])
            this.temp2.push(temp3[i]);
          }
        }
      }
    }

    this.productCertificationTable = this.temp2
  }

  SearchDateRangeSLP(){
    if (this.ApproveDateSLP != null){
      this.dateFromApproveSLP = this.ApproveDateSLP[0]
      this.dateToApproveSLP = this.ApproveDateSLP[1]
      console.log('dateFromApproveSLP',this.dateFromApproveSLP)
      console.log('dateToApproveSLP',this.dateToApproveSLP)
      let temp = this.productCertificationTable
      for (let i in temp) {
        if (temp[i].created_date) {
          if (formatDate(temp[i].created_date, "yyyy-MM-dd", "en_US") >=
          formatDate(this.dateFromApproveSLP, "yyyy-MM-dd", "en_US") &&
          formatDate(temp[i].created_date, "yyyy-MM-dd", "en_US") <=
          formatDate(this.dateToApproveSLP, "yyyy-MM-dd", "en_US")) {
            console.log('temp2',temp[i])
            this.temp2.push(temp[i]);
          }
        }
      }
    }

    if(this.ExpiryDateSLP != null){
      this.dateFromExpirySLP = this.ExpiryDateSLP[0]
      this.dateToExpirySLP = this.ExpiryDateSLP[1]
      console.log('dateFromApproveCert',this.dateFromExpirySLP)
      console.log('dateToApproveCert',this.dateToExpirySLP)

      let temp3 = this.productCertificationTable
      for (let i in temp3) {
        if (temp3[i].created_date) {
          if (formatDate(temp3[i].created_date, "yyyy-MM-dd", "en_US") >=
          formatDate(this.dateFromExpirySLP, "yyyy-MM-dd", "en_US") &&
          formatDate(temp3[i].created_date, "yyyy-MM-dd", "en_US") <=
          formatDate(this.dateToExpirySLP, "yyyy-MM-dd", "en_US")) {
            console.log('temp3',temp3[i])
            this.temp2.push(temp3[i]);
          }
        }
      }
    }

    this.SLPTable = this.temp2
  }

  widgetDataGet() {
    this.subscription = forkJoin([
      this.VisitorCounterService.get(),
      this.productCertificationService.get_TAC(),
      this.productGenerationService.get_IMEI(),
      this.productGenerationService.get_serial()
    ]).subscribe(
      (res)=>{
        this.VisitorGetTable = res[0]
        this.TACData = res[1]['TAC_count']
        this.IMEIData = res[2]['IMEI_count']
        this.serialData = res[3]['serial_count']
      }
    );
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
