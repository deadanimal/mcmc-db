import { Component, OnInit, NgZone, OnDestroy } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Router } from "@angular/router";
import { SearchCounterService } from "src/app/shared/services/SearchCounter/SearchCounter.service";
import { ProductGenerationService } from "src/app/shared/services/ProductRegistration/ProductGeneration.service";
import { productCertificationService } from "src/app/shared/services/productCertification/productCertification.service";
import { VisitorCounterService } from "src/app/shared/services/VisitorCounter/VisitorCounter.service";
import * as moment from 'moment';

am4core.useTheme(am4themes_animated);

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Chart
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  private chart: any;
  private chart1: any;
  private chart2: any;
  private chart3: any;

  counter: any
  visitorbymonth: any
  searchbymonth: any
  productData: any

  IMEITable = [];
  SerialTable = [];
  CertTable = [];
  CounterTable = [];
  SLPTable = [];
  VisitorGetTable = [];
  filterIMEI = [];
  filterSERIAL = [];
  filterPRODUCT = [];
  filterLABEL = [];
  newdata = []
  checkerDate = []
  TACData = []
  serialData = []
  IMEIData = []

  constructor(
    private zone: NgZone,
    private SearchCounterService: SearchCounterService,
    private ProductGenerationService: ProductGenerationService,
    private productCertificationService: productCertificationService,
    private VisitorCounterService: VisitorCounterService
  ) {}

  ngOnInit() {
    this.calculateCharts();
    this.CounterSearchGet();
    this.VisitorCounterGet();
    setTimeout(() => {
      this.getData();
    }, 1000);
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart1) {
        this.chart1.dispose();
      }
      if (this.chart2) {
        this.chart2.dispose();
      }
      if (this.chart3) {
        this.chart3.dispose();
      }
    });
  }

  getCharts() {
    this.zone.runOutsideAngular(() => {
      this.getChart1();
      this.getChart2();
      this.getChart3();
    });
  }

  getData(){
    this.productCertificationService.get_TAC().subscribe(
      (res)=>{
        this.TACData = res['TAC_count']

      },

    )

    this.ProductGenerationService.get_IMEI().subscribe(
      (res)=>{
        this.IMEIData = res['IMEI_count']
      }
    )

    this.ProductGenerationService.get_serial().subscribe(
      (res)=>{
        this.serialData = res['serial_count']
      }
    )

    this.ProductGenerationService.getProductChart().subscribe(
      () =>{},
      () =>{},
      () =>{
        this.counter = this.ProductGenerationService.ProductRegistration
        this.productData = this.counter['product_by_month']
        this.getChart2()
      }
    )
    this.VisitorCounterService.getVisitorChart().subscribe(
      () => {},
      () => {},
      () => {
        this.counter = this.VisitorCounterService.VisitorCounter
        this.visitorbymonth = this.counter['visitor_by_month']
        console.log("visitorchart",this.visitorbymonth )
        this.getCharts()
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
  }

  getChart1() {
    let chart = am4core.create("chartdiv1", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      {
        item: "Product Info",
        value: this.filterPRODUCT.length,
      },
      {
        item: "IMEI",
        value: this.filterIMEI.length,
      },
      {
        item: "Serial",
        value: this.filterSERIAL.length,
      },
      {
        item: "SLP ID",
        value: this.filterLABEL.length,
      },
    ];
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

    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;
    this.chart1 = chart;
  }

  getChart2() {
    let chart = am4core.create("data", am4charts.XYChart);
    console.log("new data", this.productData)

    // Add data
    chart.data = this.productData
    // Set input format for the dates
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "count";
    series.dataFields.dateX = "date";
    series.tooltipText = "{count}";
    series.strokeWidth = 2;
    series.minBulletDistance = 15;

    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.label.textValign = "middle";

    // Make bullets grow on hover
    let bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color("#fff");

    let bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panXY";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    // Create vertical scrollbar and place it before the value axis
    // chart.scrollbarY = new am4core.Scrollbar();
    // chart.scrollbarY.parent = chart.leftAxesContainer;
    // chart.scrollbarY.toBack();

    // Create a horizontal scrollbar with previe and place it underneath the date axis
    // chart.scrollbarX = new am4charts.XYChartScrollbar();
    // let scrollbarX = new am4charts.XYChartScrollbar();
    // scrollbarX.series.push(series);
    // chart.scrollbarX = scrollbarX;
    // chart.scrollbarX.parent = chart.bottomAxesContainer;

    // dateAxis.start = 0.79;
    // dateAxis.keepSelection = true;

    this.chart2 = chart;
  }

  getChart3() {
    let chart = am4core.create("portal", am4charts.XYChart);

    // Add data
    chart.data = [
      {
        year: "Jan",
        visitor: this.visitorbymonth['january'],
        search: this.searchbymonth['january'],
      },
      {
        year: "Feb",
        visitor: this.visitorbymonth['february'],
        search: this.searchbymonth['february'],
      },
      {
        year: "Mar",
        visitor: this.visitorbymonth['march'],
        search: this.searchbymonth['march'],
      },
      {
        year: "Apr",
        visitor: this.visitorbymonth['april'],
        search: this.searchbymonth['april'],
      },
      {
        year: "May",
        visitor: this.visitorbymonth['may'],
        search: this.searchbymonth['may'],
      },
      {
        year: "Jun",
        visitor: this.visitorbymonth['june'],
        search: this.searchbymonth['june'],
      },
      {
        year: "Jul",
        visitor: this.visitorbymonth['july'],
        search: this.searchbymonth['july'],
      },
      {
        year: "Aug",
        visitor: this.visitorbymonth['august'],
        search: this.searchbymonth['august'],
      },
      {
        year: "Sept",
        visitor: this.visitorbymonth['september'],
        search: this.searchbymonth['september'],
      },
      {
        year: "Oct",
        visitor: this.visitorbymonth['october'],
        search: this.searchbymonth['october'],
      },
      {
        year: "Nov",
        visitor: this.visitorbymonth['november'],
        search: this.searchbymonth['november'],
      },
    ];

    chart.exporting.menu = new am4core.ExportMenu();

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
    series1.strokeWidth = 3;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "unique";
    series2.dataFields.categoryX = "year";
    series2.name = "Unique Visitor";
    series2.bullets.push(new am4charts.CircleBullet());
    series2.tooltipText = "{name}: {valueY}";
    series2.legendSettings.valueText = "{valueY}";

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

    let hs2 = series2.segments.template.states.create("hover");
    hs2.properties.strokeWidth = 5;
    series2.segments.template.strokeWidth = 1;

    // let hs3 = series3.segments.template.states.create("hover");
    // hs3.properties.strokeWidth = 5;
    // series3.segments.template.strokeWidth = 1;

    // // Add legend
    // chart.legend = new am4charts.Legend();
    // chart.legend.itemContainers.template.events.on("over", function(event){
    //   let segments = event.target.dataItem.dataContext.segments;
    //   segments.each(function(segment){
    //     segment.isHover = true;
    //   })
    // })

    // chart.legend.itemContainers.template.events.on("out", function(event){
    //   let segments = event.target.dataItem.dataContext.segments;
    //   segments.each(function(segment){
    //     segment.isHover = false;
    //   })
    // })
  }

  calculateCharts() {
    this.SearchCounterService.filter("Name=IMEI").subscribe(
      (res) => {
        this.filterIMEI = res;
        console.log("Chart imei", this.filterIMEI);
        console.log("imei count", this.filterIMEI.length);
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );

    this.SearchCounterService.filter("Name=SERIAL").subscribe(
      (res) => {
        this.filterSERIAL = res;
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );

    this.SearchCounterService.filter("Name=PRODUCT").subscribe(
      (res) => {
        this.filterPRODUCT = res;
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );

    this.SearchCounterService.filter("Name=LABEL").subscribe(
      (res) => {
        this.filterLABEL = res
        console.log("label", this.filterLABEL.length)
        label = this.filterLABEL.length
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );

    this.ProductGenerationService.get().subscribe(
      (res) => {
         this.newdata = res
        console.log("new data", this.newdata)
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );

    let label = this.filterLABEL.length;
    let serial = this.filterSERIAL.length;
    let imei = this.filterIMEI.length;
    let product = this.filterPRODUCT.length;
    console.log(
      "label = ",
      label,
      " serial = ",
      serial,
      " imei = ",
      imei,
      "product = ",
      product
    );
  }

  CounterSearchGet() {
    this.SearchCounterService.get().subscribe(
      (res) => {
        this.CounterTable = res;
      },
      (err) => {},
      () => {}
    );

    this.ProductGenerationService.get().subscribe(
      (res) => {
        this.SLPTable = res;
      },
      (err) => {},
      () => {}
    );

    let imei = "RegType=IMEI";
    this.ProductGenerationService.filter(imei).subscribe(
      (res) => {
        this.IMEITable = res;
        console.log(this.IMEITable.length);
      },
      (err) => {},
      () => {}
    );

    let serial = "RegType=SerialNo";
    this.ProductGenerationService.filter(serial).subscribe(
      (res) => {
        this.SerialTable = res;
        console.log(this.SerialTable.length);
      },
      (err) => {},
      () => {}
    );

    this.productCertificationService.get().subscribe(
      (res) => {
        this.CertTable = res;
        console.log(this.CertTable.length);
      },
      (err) => {},
      () => {}
    );
    this.productCertificationService.filter("ProductCategory=RADIO").subscribe(
      (res) => {
        console.log("radio",res.length);
      },
      (err) => {},
      () => {}
    );

  }

  VisitorCounterGet() {
    this.VisitorCounterService.get().subscribe(
      (res) => {
        this.VisitorGetTable = res;
        console.log("counter visitor", this.VisitorGetTable.length);
      },
      (err) => {},
      () => {
        console.log("HTTP request completed.");
      }
    );
  }
}
