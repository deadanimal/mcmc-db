import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductGenerationService } from 'src/app/shared/services/ProductRegistration/ProductGeneration.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as moment from 'moment';


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

  infoTable = []
  dataSearchForm: FormGroup
  
  private categoryAxis: any

  tableEntries: number = 5;
  tableSelected: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  SelectionType = SelectionType;

  
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
    private zone: NgZone
  ) {
    this.productGeneration()
  }

  ngOnInit() {
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
        this.calculateCharts()
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

  calculateCharts() {
    // console.log('infoTable = ',this.infoTable)
    this.chartJan = 0
    this.chartFeb = 0
    this.chartMar = 0
    this.chartApr = 0
    this.chartMay = 0
    this.chartJun = 0
    this.chartJul = 0
    this.chartAug = 0
    this.chartSep = 0
    this.chartOct = 0
    this.chartNov = 0
    this.chartDec = 0
    this.infoTable.forEach(
      ((row) => {
        let checkerDate = moment(row.approveDate).format('MM')
        var date = moment('15-06-2010', 'DD-MM-YYYY')
        console.log(date.format('MM-DD-YYYY'))
        // let checkerDateMonth = checkerDate.month()

        console.log("row",row)
        console.log('qqqqq - ',new Date(row.approveDate),"--",moment(new Date()).format("MM") );
        console.log('row.approveDate = ',row.approveDate)
        console.log('checkerDate = ',checkerDate)
        // console.log('checkerDateMonth = ',checkerDateMonth)

        // if (checkerDateMonth == 0) {
        //   this.chartJan += 1
        // }
        // else if (checkerDateMonth == 1) {
        //   this.chartFeb += 1
        // }
        // else if (checkerDateMonth == 2) {
        //   this.chartMar += 1
        // }
        // else if (checkerDateMonth == 3) {
        //   this.chartApr += 1
        // }
        // else if (checkerDateMonth == 4) {
        //   this.chartMay += 1
        // }
        // else if (checkerDateMonth == 5) {
        //   this.chartJun += 1
        // }
        // else if (checkerDateMonth == 6) {
        //   this.chartJul += 1
        // }
        // else if (checkerDateMonth == 7) {
        //   this.chartAug += 1
        // }
        // else if (checkerDateMonth == 8) {
        //   this.chartSep += 1
        // }
        // else if (checkerDateMonth == 9) {
        //   this.chartOct += 1
        // }
        // else if (checkerDateMonth == 10) {
        //   this.chartNov += 1
        // }
        // else if (checkerDateMonth == 11) {
        //   this.chartDec += 1
        // }
      })
    )

    this.getPortalChart()
  }

  getPortalChart() {
    let chart = am4core.create("portalchart", am4charts.XYChart);

    // Add data
    chart.data = [{
      "month": "Jan",
      "count": this.chartJan
    }, {
      "month": "Feb",
      "count": this.chartFeb
    }, {
      "month": "Mar",
      "count": this.chartMar
    }, {
      "month": "Apr",
      "count": this.chartApr
    }, {
      "month": "May",
      "count": this.chartMar
    }, {
      "month": "Jun",
      "count": this.chartJun
    }, {
      "month": "Jul",
      "count": this.chartJul
    }, {
      "month": "Aug",
      "count": this.chartAug
    }, {
      "month": "Sep",
      "count": this.chartSep
    }, {
      "month": "Oct",
      "count": this.chartOct
    }, {
      "month": "Nov",
      "count": this.chartNov
    }, {
      "month": "Dec",
      "count": this.chartDec
    }
  ];

    // Create axes

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
      if (target.dataItem && target.dataItem.index && 2 == 2) {
        return dy + 25;
      }
      return dy;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "month";
    series.name = "count";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    this.chart = chart

  }

}
