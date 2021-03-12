import { Component, OnInit, OnDestroy, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductGenerationService } from 'src/app/shared/services/ProductRegistration/ProductGeneration.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as moment from 'moment';
import { BsDatepickerDirective } from 'ngx-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';


export enum SelectionType {
  single = 'single',
  multi = 'multi',
  multiClick = 'multiClick',
  cell = 'cell',
  checkbox = 'checkbox'
}

@Component({
  selector: 'app-data-search',
  templateUrl: './data-search.component.html',
  styleUrls: ['./data-search.component.scss']
})
export class DataSearchComponent implements OnInit, OnDestroy {

  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;
  entries: number = 10;
  infoTable = []
  dataSearchForm: FormGroup
  searchForm : FormGroup
  addNewDataForm: FormGroup
  dateSearchForm: FormGroup
  
  private categoryAxis: any

  tableEntries: number = 5;
  tableSelected: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  SelectionType = SelectionType; 

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-lg"
  };

  
  // Chart
  chartDataField:any
  chart: any
  chartJan: number = 0
  chartFeb: number = 0
  chartMar: number = 0
  chartApr: number = 0
  chartMay: number = 0
  chartJun: number = 0
  chartJul: number = 0
  chartAug: number = 0
  chartSep: number = 0
  chartOct: number = 0
  chartNov: number = 0
  chartDec: number = 0

  constructor(
    private productGenerationService: ProductGenerationService,
    private formBuilder: FormBuilder,
    private zone: NgZone,
    private modalService: BsModalService,
  ) {
    this.productGeneration()
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
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(
      () => {
        if (this.chart) {
          // console.log('Chart disposed')
          this.chart.dispose()
        }
      }
    )
  }

  filterTable(){
    let datafield = "consigneeName="+this.searchForm.value.brand
    console.log(datafield)
    this.productGenerationService.filter(datafield).subscribe(
      (res) => {
        this.infoTable=res
      },
      (err) => {
      },
      () => console.log("HTTP request completed.")
    );
  }

  filterDate($event) {
    let val = $event.target.value;
    let datafield = "approveDate="+val
    console.log(datafield)
    this.productGenerationService.filterMix(datafield).subscribe(
      (res) => {
        this.infoTable=res; 
        console.log("loop ok!!")
        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key
          };
        });
        // console.log("xxxxxx = ",this.infoTable)
      },
      (err) => {
        console.log("loop not ok!!")
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => {
        console.log("HTTP request completed.")
      //   this.infoTable = [res]
      //   console.log("zzzzz = ",this.infoTable)
      }
    );
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  } 

  filterTableModel($event) {
    let val = $event.target.value;
    let datafield = "modelId="+val
    console.log(datafield)
    this.productGenerationService.filterMix(datafield).subscribe(
      (res) => {
        this.infoTable=res; 

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key
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
        console.log("HTTP request completed.")
      //   this.infoTable = [res]
      //   console.log("zzzzz = ",this.infoTable)
      }
    );
  }

  filterTableImei($event) {
    let val = $event.target.value;
    let datafield = "imeiNo="+val
    console.log(datafield)
    this.productGenerationService.filterMix(datafield).subscribe(
      (res) => {
        this.infoTable=res; 

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key
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
        console.log("HTTP request completed.")
      //   this.infoTable = [res]
      //   console.log("zzzzz = ",this.infoTable)
      }
    );
  }

  filterTableConsignee($event) {
    let val = $event.target.value;
    let datafield = "consigneeName="+val
    console.log(datafield)
    this.productGenerationService.filterMix(datafield).subscribe(
      (res) => {
        this.infoTable=res; 

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key
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
        console.log("HTTP request completed.")
      //   this.infoTable = [res]
      //   console.log("zzzzz = ",this.infoTable)
      }
    );
  }

  filterTableCategory($event) {
    console.log('event = ',$event)
    let val = $event
    let datafield = "productCategory="+val
    console.log(datafield)
    this.productGenerationService.filterMix(datafield).subscribe(
      (res) => {
        this.infoTable=res; 

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key
          };
        });
      },
      (err) => {
      },
      () => {
        console.log("HTTP request completed.")
      }
    );
  }

  filterTableSerial($event) {
    let val = $event.target.value;
    let datafield = "serialNo="+val
    console.log(datafield)
    this.productGenerationService.filterMix(datafield).subscribe(
      (res) => {
        this.infoTable=res; 

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key
          };
        });
      },
      (err) => {
      },
      () => {
        console.log("HTTP request completed.")
      }
    );
  }

  filterTableSLPID($event) {
    let val = $event.target.value;
    let datafield = "SLPID="+val
    console.log(datafield)
    this.productGenerationService.filterMix(datafield).subscribe(
      (res) => {
        this.infoTable=res; 

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key
          };
        });
      },
      (err) => {
      },
      () => {
        console.log("HTTP request completed.")
      }
    );
  }

  productGeneration() {
    this.productGenerationService.get().subscribe(
      (res) => {
        this.infoTable = [...res]
        // console.log("zzzzz = ",this.infoTable)
        // let qweqwe = []
        // this.infoTable.forEach( function(data){
        //   console.log('col- - ',data)
        //   qweqwe.push(data)

        // })
        // this.chartDataField = qweqwe
        // console.log('bbbbbbb = ',this.chartDataField)
        // this.calculateCharts()
        console.log(this.infoTable.length)

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key
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
        console.log("HTTP request completed.")
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
    console.log(this.addNewDataForm.value)
    this.productGenerationService.post(this.addNewDataForm.value).subscribe(
      () => {
        // Success
        // this.isLoading = false
        // this.successMessage();
        // this.loadingBar.complete();
        // this.successAlert("create project");
        this.productGeneration()
        console.log("success")
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
    this.modal.hide()
  }

}
