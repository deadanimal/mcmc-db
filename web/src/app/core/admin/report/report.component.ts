import { productCertification } from './../../../shared/services/productCertification/productCertification.model';
import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  TemplateRef,
} from "@angular/core";
import { User } from "src/assets/mock/admin-user/users.model";
import { MocksService } from "src/app/shared/services/mocks/mocks.service";
import { MasterDataService } from "src/app/shared/services/masterData/masterData.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { UsersService } from "src/app/shared/services/users/users.service";
import * as XLSX from "xlsx";
import { SearchCounterService } from "src/app/shared/services/SearchCounter/SearchCounter.service";
import { SLPService } from "src/app/shared/services/SLP/SLP.service";
import { ProductGenerationService } from "src/app/shared/services/ProductRegistration/ProductGeneration.service";
import { productCertificationService } from "src/app/shared/services/productCertification/productCertification.service";
import { VisitorCounterService } from "src/app/shared/services/VisitorCounter/VisitorCounter.service";
import { forkJoin, Subscription } from "rxjs";
am4core.useTheme(am4themes_animated);
am4core.addLicense('ch-custom-attribution');

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit, OnDestroy {
  // Chart
  chart: any
  chart1: any
  chart2: any
  chart3: any
  chart4: any
  dataChart: any[] = []
  dataChart2: any[] = []
  dataChart3: any[] = []
  chartData: any[] = []
  chartData2: any[] = []
  chartdata3: any[] = []
  chartdataMaster: any[] = []
  user: any
  counter: any
  visitorbymonth: any
  searchbymonth: any
  imeiData: any
  serialData: any
  tacData: any

  tableEntries: number = 5
  tableSelected: any[] = []
  tableTemp = []
  tableActiveRow: any
  SelectionType = SelectionType
  infoTable = []
  CounterTable = []
  SLPTable = []
  IMEITable = []
  SerialTable = []
  CertTable = []
  filterIMEI = []
  filterSERIAL = []
  filterPRODUCT = []
  filterLABEL = []
  VisitorGetTable = []
  TACData = []
  IMEIData = []
  SERIALData = []
  TOTALData = []
  getDataDB = []
  thisMonthSearch: any = []
  totalSearch: any
  currentProduct = []
  IMEIcount = []
  SERIALcount = []
  TACcount = []
  userdata=[]
  searchMonthly
  searchMonth
  dataSearchForm: FormGroup
  percent: any

  new
  exist

  event = 'new'

  subscription: Subscription;

  state: boolean = false
  isSummaryTableHidden: boolean = true
  fileName = "MasterTable.xlsx"

  // Datepicker
  bsDPConfig = {
    isAnimated: true,
    containerClass: "theme-default",
  };

  constructor(
    private mockService: MocksService,
    private zone: NgZone,
    private masterDataService: MasterDataService,
    private usersService: UsersService,
    private SearchCounterService: SearchCounterService,
    private SLPService: SLPService,
    private ProductGenerationService: ProductGenerationService,
    private productCertificationService: productCertificationService,
    private VisitorCounterService: VisitorCounterService
  ) {}

  ngOnInit() {
    this.widgetDataGet();
    this.productGeneration();
    // this.VisitorCounterGet();
    this.calculateCharts();
    this.getData()
    setTimeout(() => {
      this.chartData = [
        {
          year: "Jan",
          search: this.searchbymonth['january'],
        },
        {
          year: "Feb",
          search: this.searchbymonth['february'],
        },
        {
          year: "Mar",
          search: this.searchbymonth['march'],
        },
        {
          year: "Apr",
          search: this.searchbymonth['april'],
        },
        {
          year: "May",
          search: this.searchbymonth['may'],
        },
        {
          year: "Jun",
          search: this.searchbymonth['june'],
        },
        {
          year: "Jul",
          search: this.searchbymonth['july'],
        },
        {
          year: "Aug",
          search: this.searchbymonth['august'],
        },
        {
          year: "Sept",
          search: this.searchbymonth['september'],
        },
        {
          year: "Oct",
          search: this.searchbymonth['october'],
        },
        {
          year: "Nov",
          search: this.searchbymonth['november'],
        },
      ]
      this.chartData2 = [
        {
          year: "Jan",
          visitor: this.visitorbymonth['january'],  
        },
        {
          year: "Feb",
          visitor: this.visitorbymonth['february'],
        },
        {
          year: "Mar",
          visitor: this.visitorbymonth['march'],
        },
        {
          year: "Apr",
          visitor: this.visitorbymonth['april'],
        },
        {
          year: "May",
          visitor: this.visitorbymonth['may'],
        },
        {
          year: "Jun",
          visitor: this.visitorbymonth['june'],
        },
        {
          year: "Jul",
          visitor: this.visitorbymonth['july'],
        },
        {
          year: "Aug",
          visitor: this.visitorbymonth['august'],
        },
        {
          year: "Sept",
          visitor: this.visitorbymonth['september'],
        },
        {
          year: "Oct",
          visitor: this.visitorbymonth['october'],
        },
        {
          year: "Nov",
          visitor: this.visitorbymonth['november']
        },
      ]
      this.chartdata3 = [
        {
          item: "Product Info",
          value: this.searchMonthly['product'],
        },
        {
          item: "IMEI",
          value: this.searchMonthly['imei'],
        },
        {
          item: "Serial",
          value: this.searchMonthly['serial'],
        },
        {
          item: "SLP ID",
          value: this.searchMonthly['label'],
        }
      ]
      this.chartdataMaster = [
        {
          year: "Jan",
          IMEI: this.imeiData['january'],
          Serial: this.serialData['january'],
          TAC: this.tacData['january']
        },
        {
          year: "Feb",
          IMEI: this.imeiData['february'],
          Serial: this.serialData['february'],
          TAC: this.tacData['february']
        },
        {
          year: "Mar",
          IMEI: this.imeiData['march'],
          Serial: this.serialData['march'],
          TAC: this.tacData['march']
        },
        {
          year: "Apr",
          IMEI: this.imeiData['april'],
          Serial: this.serialData['april'],
          TAC: this.tacData['april'],
        },
        {
          year: "May",
          IMEI: this.imeiData['may'],
          Serial: this.serialData['may'],
          TAC: this.tacData['may']
        },
        {
          year: "Jun",
          IMEI: this.imeiData['june'],
          Serial: this.serialData['june'],
          TAC: this.tacData['june'],
        },
        {
          year: "Jul",
          IMEI: this.imeiData['july'],
          Serial: this.serialData['july'],
          TAC: this.tacData['july']
        },
        {
          year: "Aug",
          IMEI: this.imeiData['august'],
          Serial: this.serialData['august'],
          TAC: this.tacData['august']
        },
        {
          year: "Sept",
          IMEI: this.imeiData['september'],
          Serial: this.serialData['september'],
          TAC: this.tacData['september']
        },
        {
          year: "Oct",
          IMEI: this.imeiData['october'],
          Serial: this.serialData['october'],
          TAC: this.tacData['october']
        },
        {
          year: "Nov",
          IMEI: this.imeiData['november'],
          Serial: this.serialData['november'],
          TAC: this.tacData['november']
        },
        {
          year: "Dec",
          IMEI: this.imeiData['december'],
          Serial: this.serialData['december'],
          TAC: this.tacData['december']
        }
      ];
      this.getCharts()
      this.calculate()
    }, 20000);
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
      if (this.chart1) {
        this.chart1.dispose();
      }
      if (this.chart2) {
        this.chart2.dispose();
      }
      if (this.chart3) {
        this.chart3.dispose();
      }
      if (this.chart4) {
        this.chart4.dispose();
      }
    });
  }

  getData() {
    this.VisitorCounterService.getVisitorChart().subscribe(
      () => {},
      () => {},
      () => {
        this.counter = this.VisitorCounterService.VisitorCounter
        this.visitorbymonth = this.counter['visitor_by_month']
        console.log("visitorchart",this.visitorbymonth)
      })

    this.SearchCounterService.getSearchChart().subscribe(
      () => {},
      () => {},
      () => {
        this.counter = this.SearchCounterService.SearchCounter
        this.searchbymonth = this.counter['search_by_month']
        console.log("searchchart",this.visitorbymonth )
        this.getCharts()
      })

      this.ProductGenerationService.getIMEIChart().subscribe(
        () =>{},
        () => {},
        () =>{
          this.counter = this.ProductGenerationService.ProductRegistration
          this.imeiData = this.counter['imei_by_month']
        }
      )

      this.ProductGenerationService.getSerialChart().subscribe(
        () =>{},
        () => {},
        () =>{
          this.counter = this.ProductGenerationService.ProductRegistration
          this.serialData = this.counter['serial_by_month']
        }
      )

      this.productCertificationService.GetTACChart().subscribe(
        () =>{},
        () => {},
        () =>{
          this.counter = this.productCertificationService.productCertification
          this.tacData = this.counter['tac_by_month']
        }
      )
  }

  productGeneration() {
    this.masterDataService.get().subscribe(
      (res) => {
        this.infoTable = [...res];
        console.log("zzzzz = ", this.infoTable);

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
        console.log("xxxxxx = ", this.infoTable);
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

  getCharts() {
    this.zone.runOutsideAngular(() => {
      this.getChart()
      this.getChart2()
      this.getChart3()
    });
  }

  getChart() {
    let chart = am4core.create("visitorChart", am4charts.XYChart);

    chart.data=this.chartData2

    chart.exporting.menu = new am4core.ExportMenu();

    chart.exporting.menu.items = [{
          "label": "...",
          "menu": [
            {
              "label": "Image",
              "menu": [
                { "type": "png", "label": "PNG" },
                { "type": "jpg", "label": "JPG" },
                { "type": "svg", "label": "SVG" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Print", "type": "print"
            }
          ]
    }];

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.opposite = false;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = false;
    // valueAxis.title.text = "Place taken";
    valueAxis.renderer.minLabelPosition = 0.01;

    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "visitor";
    series1.dataFields.categoryX = "year";
    series1.name = "Total Visitor";
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = "{name}: {valueY}";
    series1.legendSettings.valueText = "{valueY}";
    series1.strokeWidth = 3; // 3px
    series1.visible = false;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "unique";
    series2.dataFields.categoryX = "year";
    series2.name = "Unique Visitor";
    series2.bullets.push(new am4charts.CircleBullet());
    series2.tooltipText = "{name}: {valueY}";
    series2.legendSettings.valueText = "{valueY}";

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";

    let hs1 = series1.segments.template.states.create("hover");
    hs1.properties.strokeWidth = 5;
    series1.segments.template.strokeWidth = 1;

    let hs2 = series2.segments.template.states.create("hover");
    hs2.properties.strokeWidth = 5;
    series2.segments.template.strokeWidth = 1;

    this.chart = chart;
  }

  getChart2() {
    let chart = am4core.create("systemChart", am4charts.XYChart);

    chart.data = this.chartData

    chart.exporting.menu = new am4core.ExportMenu();

    chart.exporting.menu.items = [{
          "label": "...",
          "menu": [
            {
              "label": "Image",
              "menu": [
                { "type": "png", "label": "PNG" },
                { "type": "jpg", "label": "JPG" },
                { "type": "svg", "label": "SVG" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Print", "type": "print"
            }
          ]
    }];

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.opposite = false;
    categoryAxis.renderer.minGridDistance = 40;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = false;
    // valueAxis.title.text = "Place taken";
    valueAxis.renderer.minLabelPosition = 0.01;

    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "visitor";
    series1.dataFields.categoryX = "year";
    series1.name = "Total Visitor";
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = "{name}: {valueY}";
    series1.legendSettings.valueText = "{valueY}";
    series1.visible = false;

    let series3 = chart.series.push(new am4charts.ColumnSeries());
    series3.dataFields.valueY = "search";
    series3.dataFields.categoryX = "year";
    series3.name = "Total Search";
    series3.tooltipText = "{name}: {valueY}";
    series3.legendSettings.valueText = "{valueY}";

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";

    let hs1 = series1.segments.template.states.create("hover");
    hs1.properties.strokeWidth = 5;
    series1.segments.template.strokeWidth = 1;

    this.chart2 = chart;
  }

  calculateCharts() {
    this.subscription = forkJoin([
      this.SearchCounterService.getSearchMonthly(),
      this.SearchCounterService.getSearchMonth()
    ]).subscribe(
      (res) => {
        this.searchMonthly = res[0]
        console.log('searchMonthly', this.searchMonthly)
        this.searchMonth = res[1]
      })

  }

  getChart3() {
    let chart = am4core.create("totalSearch", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.exporting.menu = new am4core.ExportMenu();

    chart.exporting.menu.items = [{
          "label": "...",
          "menu": [
            {
              "label": "Image",
              "menu": [
                { "type": "png", "label": "PNG" },
                { "type": "jpg", "label": "JPG" },
                { "type": "svg", "label": "SVG" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Print", "type": "print"
            }
          ]
    }];

    chart.data = this.chartdata3

    console.log("chart.data", chart.data);
    chart.radius = am4core.percent(70);
    chart.innerRadius = am4core.percent(40);
    chart.startAngle = 0;
    chart.endAngle = 360;

    let series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "item";
    series.ticks.template.disabled = true;
    series.labels.template.disabled = true;

    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;
    series.slices.template.draggable = true;
    series.slices.template.inert = true;
    series.alignLabels = false;

    series.hiddenState.properties.startAngle = 0;
    series.hiddenState.properties.endAngle = 360;

    this.chart3 = chart;
  }

  MasterChart() {
    let chart = am4core.create("MasterGraphChart", am4charts.XYChart);

    // Add data
    chart.data = this.chartdataMaster

    chart.exporting.menu = new am4core.ExportMenu();

    chart.exporting.menu.items = [{
          "label": "...",
          "menu": [
            {
              "label": "Image",
              "menu": [
                { "type": "png", "label": "PNG" },
                { "type": "jpg", "label": "JPG" },
                { "type": "svg", "label": "SVG" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Print", "type": "print"
            }
          ]
    }];

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.opposite = false;
    categoryAxis.renderer.minGridDistance = 40;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = false;
    valueAxis.renderer.minLabelPosition = 0.01;

    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "TAC";
    series1.dataFields.categoryX = "year";
    series1.name = "TAC";
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = "{name}: {valueY}";
    series1.legendSettings.valueText = "{valueY}";
    series1.visible = false;
    series1.fill = am4core.color("yellow");
    series1.strokeWidth = 3;

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "IMEI";
    series2.dataFields.categoryX = "year";
    series2.name = "IMEI";
    series2.tooltipText = "{name}: {valueY}";
    series2.legendSettings.valueText = "{valueY}";
    series2.fill = am4core.color("#ff5733")

    let series3 = chart.series.push(new am4charts.ColumnSeries());
    series3.dataFields.valueY = "Serial";
    series3.dataFields.categoryX = "year";
    series3.name = "Serial";
    series3.tooltipText = "{name}: {valueY}";
    series3.legendSettings.valueText = "{valueY}";
    series3.fill = am4core.color("#355C7D")

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";

    let hs1 = series1.segments.template.states.create("hover");
    hs1.properties.strokeWidth = 5;
    series1.segments.template.strokeWidth = 1;


    this.chart4 = chart;
  }

  isAllowed = (optional) => {
    return optional === 0 ? true : this.state;
  };

  changeState = () => {
    this.state = !this.state;
    this.chartdataMaster = [
      {
        year: "Jan",
        IMEI: this.imeiData['january'],
        Serial: this.serialData['january'],
        TAC: this.tacData['january']
      },
      {
        year: "Feb",
        IMEI: this.imeiData['february'],
        Serial: this.serialData['february'],
        TAC: this.tacData['february']
      },
      {
        year: "Mar",
        IMEI: this.imeiData['march'],
        Serial: this.serialData['march'],
        TAC: this.tacData['march']
      },
      {
        year: "Apr",
        IMEI: this.imeiData['april'],
        Serial: this.serialData['april'],
        TAC: this.tacData['april'],
      },
      {
        year: "May",
        IMEI: this.imeiData['may'],
        Serial: this.serialData['may'],
        TAC: this.tacData['may']
      },
      {
        year: "Jun",
        IMEI: this.imeiData['june'],
        Serial: this.serialData['june'],
        TAC: this.tacData['june'],
      },
      {
        year: "Jul",
        IMEI: this.imeiData['july'],
        Serial: this.serialData['july'],
        TAC: this.tacData['july']
      },
      {
        year: "Aug",
        IMEI: this.imeiData['august'],
        Serial: this.serialData['august'],
        TAC: this.tacData['august']
      },
      {
        year: "Sept",
        IMEI: this.imeiData['september'],
        Serial: this.serialData['september'],
        TAC: this.tacData['september']
      },
      {
        year: "Oct",
        IMEI: this.imeiData['october'],
        Serial: this.serialData['october'],
        TAC: this.tacData['october']
      },
      {
        year: "Nov",
        IMEI: this.imeiData['november'],
        Serial: this.serialData['november'],
        TAC: this.tacData['november']
      },
      {
        year: "Dec",
        IMEI: this.imeiData['december'],
        Serial: this.serialData['december'],
        TAC: this.tacData['december']
      }
    ];
    setTimeout(() => {
      this.MasterChart()
    }, 3000);
  };

  toggleEmail(event){
    console.log(event)
    if(event ==='new'){
      this.chartData = [
        {
          year: "Jan",
          search: 0,
        },
        {
          year: "Feb",
          search: 0,
        },
        {
          year: "Mar",
          search: 0,
        },
        {
          year: "Apr",
          search: 0,
        },
        {
          year: "May",
          search: 0,
        },
        {
          year: "Jun",
          search: 0,
        },
        {
          year: "Jul",
          search: 0,
        },
        {
          year: "Aug",
          search: 0,
        },
        {
          year: "Sept",
          search: 0,
        },
        {
          year: "Oct",
          search: 0,
        },
        {
          year: "Nov",
          search: 0,
        },
        {
          year: "Dec",
          search: 0
        }
      ]
        this.getChart2()
    }
    else if (event ==='total'){
      this.chartData = [
        {
          year: "2020",
          search: 0
        },
        {
          year:"2021",
          search: this.totalSearch
        }
      ]
      this.getChart2()
    }
    else{
      this.chartData = [
        {
          year: "Jan",
          search: this.searchbymonth['january'],
        },
        {
          year: "Feb",
          search: this.searchbymonth['february'],
        },
        {
          year: "Mar",
          search: this.searchbymonth['march'],
        },
        {
          year: "Apr",
          search: this.searchbymonth['april'],
        },
        {
          year: "May",
          search: this.searchbymonth['may'],
        },
        {
          year: "Jun",
          search: this.searchbymonth['june'],
        },
        {
          year: "Jul",
          search: this.searchbymonth['july'],
        },
        {
          year: "Aug",
          search: this.searchbymonth['august'],
        },
        {
          year: "Sept",
          search: this.searchbymonth['september'],
        },
        {
          year: "Oct",
          search: this.searchbymonth['october'],
        },
        {
          year: "Nov",
          search: this.searchbymonth['november'],
        },
        {
          year: "Dec",
          search: this.searchbymonth['december']
        }
      ]
        this.getChart2()
    }
  }

  toggleEmail2(event){
    console.log(event)
    if(event ==='total'){
      this.chartData2 = [{
        year: "2020",
        visitor: 25,
      }, {
        "year": "2021",
        visitor: this.VisitorGetTable.length,
      }
      ];
        this.getChart()
    }
    else if(event === 'new') {
      this.chartData2 = [
        {
          year: "Jan",
          visitor: 0,
        },
        {
          year: "Feb",
          visitor: 0,
        },
        {
          year: "Mar",
          visitor: 0,
        },
        {
          year: "Apr",
          visitor: 0,
        },
        {
          year: "May",
          visitor:0,
        },
        {
          year: "Jun",
          visitor: 0,
        },
        {
          year: "Jul",
          visitor: 0,
        },
        {
          year: "Aug",
          visitor: 0,
        },
        {
          year: "Sept",
          visitor:0,
        },
        {
          year: "Oct",
          visitor: 0,
        },
        {
          year: "Nov",
          visitor: 0
        },
        {
          year: "Dec",
          visitor: 0
        }
      ]
        this.getChart()
    }
    else{
      this.chartData2 = [
        {
          year: "Jan",
          visitor: this.visitorbymonth['january'],  
        },
        {
          year: "Feb",
          visitor: this.visitorbymonth['february'],
        },
        {
          year: "Mar",
          visitor: this.visitorbymonth['march'],
        },
        {
          year: "Apr",
          visitor: this.visitorbymonth['april'],
        },
        {
          year: "May",
          visitor: this.visitorbymonth['may'],
        },
        {
          year: "Jun",
          visitor: this.visitorbymonth['june'],
        },
        {
          year: "Jul",
          visitor: this.visitorbymonth['july'],
        },
        {
          year: "Aug",
          visitor: this.visitorbymonth['august'],
        },
        {
          year: "Sept",
          visitor: this.visitorbymonth['september'],
        },
        {
          year: "Oct",
          visitor: this.visitorbymonth['october'],
        },
        {
          year: "Nov",
          visitor: this.visitorbymonth['november']
        },
        {
          year: "Dec",
          visitor: this.visitorbymonth['december']
        }
      ]
        this.getChart()
    }
  }

  toggleEmail3(event){
    console.log(event)
    if(event ==='new'){
      this.chartdata3 = [
        {
          item: "Product Info",
          value: this.searchMonth['product'],
        },
        {
          item: "IMEI",
          value: this.searchMonth['imei'],
        },
        {
          item: "Serial",
          value: this.searchMonth['serial'],
        },
        {
          item: "SLP ID",
          value: this.searchMonth['label'],
        }
      ]
      this.getChart3()
    }
    else {
      this.chartdata3 = [
        {
          item: "Product Info",
          value: this.searchMonthly['product'],
        },
        {
          item: "IMEI",
          value: this.searchMonthly['imei'],
        },
        {
          item: "Serial",
          value: this.searchMonthly['serial'],
        },
        {
          item: "SLP ID",
          value: this.searchMonthly['label'],
        }
      ]
      this.getChart3()
    }
    // else{
    //   this.chartdata3 = [
    //     {
    //       item: "Product Info",
    //       value: 2,
    //     },
    //     {
    //       item: "IMEI",
    //       value: 2,
    //     },
    //     {
    //       item: "Serial",
    //       value: 2,
    //     },
    //     {
    //       item: "SLP ID",
    //       value: 2,
    //     },
    //   ]
    //     this.getChart3()
    // }
  }

  toggleEmail4(event){
    if(event ==='new'){
      this.chartdataMaster = [
        {
          year: "Jan",
          IMEI: 0,
          Serial: 0,
          TAC: 0
        },
        {
          year: "Feb",
          IMEI: 0,
          Serial: 0,
          TAC: 0
        },
        {
          year: "Mar",
          IMEI: 0,
          Serial: 0,
          TAC: 0
        },
        {
          year: "Apr",
          IMEI: 0,
          Serial: 0,
          TAC: 0,
        },
        {
          year: "May",
          IMEI: 0,
          Serial: 0,
          TAC: 0
        },
        {
          year: "Jun",
          IMEI: 0,
          Serial: 0,
          TAC: 0,
        },
        {
          year: "Jul",
          IMEI: 0,
          Serial: 0,
          TAC: 0
        },
        {
          year: "Aug",
          IMEI: 0,
          Serial: 0,
          TAC: 0
        },
        {
          year: "Sept",
          IMEI: 0,
          Serial: 0,
          TAC: 0
        },
        {
          year: "Oct",
          IMEI: 0,
          Serial: 0,
          TAC: 0
        },
        {
          year: "Nov",
          IMEI: 0,
          Serial: 0,
          TAC: 0
        },
        {
          year: "Dec",
          IMEI: 0,
          Serial: 0,
          TAC: 0
        }
      ];
      this.MasterChart()
    }
    else if (event === 'total') {
      this.chartdataMaster = [
        {
          year: "2020",
          IMEI: 0,
          Serial: 0,
          TAC: 0
        },
        {
          year: "2021",
          IMEI: this.IMEIcount,
          Serial: this.SERIALcount,
          TAC: this.TACcount
        },
      ]
      this.MasterChart()
    }
    else{
      this.chartdataMaster = [
        {
          year: "Jan",
          IMEI: this.imeiData['january'],
          Serial: this.serialData['january'],
          TAC: this.tacData['january']
        },
        {
          year: "Feb",
          IMEI: this.imeiData['february'],
          Serial: this.serialData['february'],
          TAC: this.tacData['february']
        },
        {
          year: "Mar",
          IMEI: this.imeiData['march'],
          Serial: this.serialData['march'],
          TAC: this.tacData['march']
        },
        {
          year: "Apr",
          IMEI: this.imeiData['april'],
          Serial: this.serialData['april'],
          TAC: this.tacData['april'],
        },
        {
          year: "May",
          IMEI: this.imeiData['may'],
          Serial: this.serialData['may'],
          TAC: this.tacData['may']
        },
        {
          year: "Jun",
          IMEI: this.imeiData['june'],
          Serial: this.serialData['june'],
          TAC: this.tacData['june'],
        },
        {
          year: "Jul",
          IMEI: this.imeiData['july'],
          Serial: this.serialData['july'],
          TAC: this.tacData['july']
        },
        {
          year: "Aug",
          IMEI: this.imeiData['august'],
          Serial: this.serialData['august'],
          TAC: this.tacData['august']
        },
        {
          year: "Sept",
          IMEI: this.imeiData['september'],
          Serial: this.serialData['september'],
          TAC: this.tacData['september']
        },
        {
          year: "Oct",
          IMEI: this.imeiData['october'],
          Serial: this.serialData['october'],
          TAC: this.tacData['october']
        },
        {
          year: "Nov",
          IMEI: this.imeiData['november'],
          Serial: this.serialData['november'],
          TAC: this.tacData['november']
        },
        {
          year: "Dec",
          IMEI: this.imeiData['december'],
          Serial: this.serialData['december'],
          TAC: this.tacData['december']
        }
      ];
        this.MasterChart()
    }
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

  exportexcel() {
    /* table id is passed over here */
    let element = document.getElementById("excel-table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    console.log("export", element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  counterChart() {
    let filterIMEI = "Name=IMEI";
    this.SearchCounterService.filter(filterIMEI).subscribe(
      (res) => {
        this.filterIMEI = res;
      },
      (err) => {},
      () => {}
    );

    let filterSERIAL = "Name=SERIAL";
    this.SearchCounterService.filter(filterSERIAL).subscribe(
      (res) => {
        this.filterSERIAL = res;
      },
      (err) => {},
      () => {}
    );

    var filterPRODUCT = "Name=PRODUCT";
    this.SearchCounterService.filter(filterPRODUCT).subscribe(
      (res) => {
        this.filterPRODUCT = res;
      },
      (err) => {},
      () => {}
    );

    var filterLABEL = "Name=LABEL";
    this.SearchCounterService.filter(filterLABEL).subscribe(
      (res) => {
        this.filterLABEL = res;
        console.log("label", this.filterLABEL.length);
      },
      (err) => {},
      () => {}
    );
  }

  // VisitorCounterGet() {
  //   this.VisitorCounterService.get().subscribe(
  //     (res) => {
  //       this.VisitorGetTable = res;
  //       console.log("counter visitor", this.VisitorGetTable.length);
  //     },
  //     (err) => {},
  //     () => {
  //       console.log("HTTP request completed.");
  //     }
  //   )

  //   this.productCertificationService.get_TAC().subscribe(
  //     (res)=>{
  //       this.TACcount = res['TAC_count']

  //     },
  //   )

  //   this.ProductGenerationService.get_IMEI().subscribe(
  //     (res)=>{
  //       this.IMEIcount = res['IMEI_count']
  //     }
  //   )

  //   this.ProductGenerationService.get_serial().subscribe(
  //     (res)=>{
  //       this.SERIALcount = res['serial_count']
  //       this.currentProduct = res['current_product']
  //     }
  //   )

  //   this.SearchCounterService.getSearchCounter().subscribe(
  //     (res) => {
  //       this.thisMonthSearch = res['get_current_counter']
  //       this.totalSearch = res['get_counter']
  //     }
  //   )

  //   this.usersService.getAll().subscribe(
  //     (res)=>{
  //       this.userdata = res
  //     }
  //   )
  // }

  widgetDataGet() {
    this.subscription = forkJoin([
      this.VisitorCounterService.get(),
      this.productCertificationService.get_TAC(),
      this.ProductGenerationService.getWidget(),
      this.SearchCounterService.getSearchCounter(),
      this.usersService.getAll(),
    ]).subscribe(
      (res)=>{
        this.VisitorGetTable = res[0]
        this.TACData = res[1]['TAC_count']
        this.getDataDB = res[2]
        this.thisMonthSearch = res[3]['get_current_counter']
        this.totalSearch = res[3]['get_counter']
        this.userdata = res[4]
        this.IMEIData = this.getDataDB[0]['imei_count']
        this.SERIALData = this.getDataDB[0]['serial_count']
        this.TOTALData = this.getDataDB[0]['total_product']
        this.currentProduct = this.getDataDB[0]['total_product_month']
        console.log('this.currentProduct',this.currentProduct)
        console.log('thisMonthSearch',this.thisMonthSearch)
        console.log('this.totalSearch',this.totalSearch)
      }
    );
  }

  calculate(){
    this.percent = (this.thisMonthSearch/this.totalSearch*100).toFixed(2)
  }

}
