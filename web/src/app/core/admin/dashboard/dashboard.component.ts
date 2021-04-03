import { Component, OnInit, NgZone, OnDestroy } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Router } from "@angular/router";
import { SearchCounterService } from "src/app/shared/services/SearchCounter/SearchCounter.service";
import { ProductGenerationService } from "src/app/shared/services/ProductRegistration/ProductGeneration.service";
import { productCertificationService } from "src/app/shared/services/productCertification/productCertification.service";
import { VisitorCounterService } from "src/app/shared/services/VisitorCounter/VisitorCounter.service";

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
      this.getCharts();
    }, 2000);
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

    // Add data
    chart.data = [
      {
        date: "2012-07-27",
        value: 13,
      },
      {
        date: "2012-07-28",
        value: 11,
      },
      {
        date: "2012-07-29",
        value: 15,
      },
      {
        date: "2012-07-30",
        value: 16,
      },
      {
        date: "2012-07-31",
        value: 18,
      },
      {
        date: "2012-08-01",
        value: 13,
      },
      {
        date: "2012-08-02",
        value: 22,
      },
      {
        date: "2012-08-03",
        value: 23,
      },
      {
        date: "2012-08-04",
        value: 20,
      },
      {
        date: "2012-08-05",
        value: 17,
      },
      {
        date: "2012-08-06",
        value: 16,
      },
      {
        date: "2012-08-07",
        value: 18,
      },
      {
        date: "2012-08-08",
        value: 21,
      },
      {
        date: "2012-08-09",
        value: 26,
      },
      {
        date: "2012-08-10",
        value: 24,
      },
      {
        date: "2012-08-11",
        value: 29,
      },
      {
        date: "2012-08-12",
        value: 32,
      },
      {
        date: "2012-08-13",
        value: 18,
      },
      {
        date: "2012-08-14",
        value: 24,
      },
      {
        date: "2012-08-15",
        value: 22,
      },
      {
        date: "2012-08-16",
        value: 18,
      },
      {
        date: "2012-08-17",
        value: 19,
      },
      {
        date: "2012-08-18",
        value: 14,
      },
      {
        date: "2012-08-19",
        value: 15,
      },
      {
        date: "2012-08-20",
        value: 12,
      },
      {
        date: "2012-08-21",
        value: 8,
      },
      {
        date: "2012-08-22",
        value: 9,
      },
      {
        date: "2012-08-23",
        value: 8,
      },
      {
        date: "2012-08-24",
        value: 7,
      },
      {
        date: "2012-08-25",
        value: 5,
      },
      {
        date: "2012-08-26",
        value: 11,
      },
      {
        date: "2012-08-27",
        value: 13,
      },
      {
        date: "2012-08-28",
        value: 18,
      },
      {
        date: "2012-08-29",
        value: 20,
      },
      {
        date: "2012-08-30",
        value: 29,
      },
      {
        date: "2012-08-31",
        value: 33,
      },
      {
        date: "2012-09-01",
        value: 42,
      },
      {
        date: "2012-09-02",
        value: 35,
      },
      {
        date: "2012-09-03",
        value: 31,
      },
      {
        date: "2012-09-04",
        value: 47,
      },
      {
        date: "2012-09-05",
        value: 52,
      },
      {
        date: "2012-09-06",
        value: 46,
      },
      {
        date: "2012-09-07",
        value: 41,
      },
      {
        date: "2012-09-08",
        value: 43,
      },
      {
        date: "2012-09-09",
        value: 40,
      },
      {
        date: "2012-09-10",
        value: 39,
      },
      {
        date: "2012-09-11",
        value: 34,
      },
      {
        date: "2012-09-12",
        value: 29,
      },
      {
        date: "2012-09-13",
        value: 34,
      },
      {
        date: "2012-09-14",
        value: 37,
      },
      {
        date: "2012-09-15",
        value: 42,
      },
      {
        date: "2012-09-16",
        value: 49,
      },
      {
        date: "2012-09-17",
        value: 46,
      },
      {
        date: "2012-09-18",
        value: 47,
      },
      {
        date: "2012-09-19",
        value: 55,
      },
      {
        date: "2012-09-20",
        value: 59,
      },
      {
        date: "2012-09-21",
        value: 58,
      },
      {
        date: "2012-09-22",
        value: 57,
      },
      {
        date: "2012-09-23",
        value: 61,
      },
      {
        date: "2012-09-24",
        value: 59,
      },
      {
        date: "2012-09-25",
        value: 67,
      },
      {
        date: "2012-09-26",
        value: 65,
      },
      {
        date: "2012-09-27",
        value: 61,
      },
      {
        date: "2012-09-28",
        value: 66,
      },
      {
        date: "2012-09-29",
        value: 69,
      },
      {
        date: "2012-09-30",
        value: 71,
      },
      {
        date: "2012-10-01",
        value: 67,
      },
      {
        date: "2012-10-02",
        value: 63,
      },
      {
        date: "2012-10-03",
        value: 46,
      },
      {
        date: "2012-10-04",
        value: 32,
      },
      {
        date: "2012-10-05",
        value: 21,
      },
      {
        date: "2012-10-06",
        value: 18,
      },
      {
        date: "2012-10-07",
        value: 21,
      },
      {
        date: "2012-10-08",
        value: 28,
      },
      {
        date: "2012-10-09",
        value: 27,
      },
      {
        date: "2012-10-10",
        value: 36,
      },
      {
        date: "2012-10-11",
        value: 33,
      },
      {
        date: "2012-10-12",
        value: 31,
      },
      {
        date: "2012-10-13",
        value: 30,
      },
      {
        date: "2012-10-14",
        value: 34,
      },
      {
        date: "2012-10-15",
        value: 38,
      },
      {
        date: "2012-10-16",
        value: 37,
      },
      {
        date: "2012-10-17",
        value: 44,
      },
      {
        date: "2012-10-18",
        value: 49,
      },
      {
        date: "2012-10-19",
        value: 53,
      },
      {
        date: "2012-10-20",
        value: 57,
      },
      {
        date: "2012-10-21",
        value: 60,
      },
      {
        date: "2012-10-22",
        value: 61,
      },
      {
        date: "2012-10-23",
        value: 69,
      },
      {
        date: "2012-10-24",
        value: 67,
      },
      {
        date: "2012-10-25",
        value: 72,
      },
      {
        date: "2012-10-26",
        value: 77,
      },
      {
        date: "2012-10-27",
        value: 75,
      },
      {
        date: "2012-10-28",
        value: 70,
      },
      {
        date: "2012-10-29",
        value: 72,
      },
      {
        date: "2012-10-30",
        value: 70,
      },
      {
        date: "2012-10-31",
        value: 72,
      },
      {
        date: "2012-11-01",
        value: 73,
      },
      {
        date: "2012-11-02",
        value: 67,
      },
      {
        date: "2012-11-03",
        value: 68,
      },
      {
        date: "2012-11-04",
        value: 65,
      },
      {
        date: "2012-11-05",
        value: 71,
      },
      {
        date: "2012-11-06",
        value: 75,
      },
      {
        date: "2012-11-07",
        value: 74,
      },
      {
        date: "2012-11-08",
        value: 71,
      },
      {
        date: "2012-11-09",
        value: 76,
      },
      {
        date: "2012-11-10",
        value: 77,
      },
      {
        date: "2012-11-11",
        value: 81,
      },
      {
        date: "2012-11-12",
        value: 83,
      },
      {
        date: "2012-11-13",
        value: 80,
      },
      {
        date: "2012-11-14",
        value: 81,
      },
      {
        date: "2012-11-15",
        value: 87,
      },
      {
        date: "2012-11-16",
        value: 82,
      },
      {
        date: "2012-11-17",
        value: 86,
      },
      {
        date: "2012-11-18",
        value: 80,
      },
      {
        date: "2012-11-19",
        value: 87,
      },
      {
        date: "2012-11-20",
        value: 83,
      },
      {
        date: "2012-11-21",
        value: 85,
      },
      {
        date: "2012-11-22",
        value: 84,
      },
      {
        date: "2012-11-23",
        value: 82,
      },
      {
        date: "2012-11-24",
        value: 73,
      },
      {
        date: "2012-11-25",
        value: 71,
      },
      {
        date: "2012-11-26",
        value: 75,
      },
      {
        date: "2012-11-27",
        value: 79,
      },
      {
        date: "2012-11-28",
        value: 70,
      },
      {
        date: "2012-11-29",
        value: 73,
      },
      {
        date: "2012-11-30",
        value: 61,
      },
      {
        date: "2012-12-01",
        value: 62,
      },
      {
        date: "2012-12-02",
        value: 66,
      },
      {
        date: "2012-12-03",
        value: 65,
      },
      {
        date: "2012-12-04",
        value: 73,
      },
      {
        date: "2012-12-05",
        value: 79,
      },
      {
        date: "2012-12-06",
        value: 78,
      },
      {
        date: "2012-12-07",
        value: 78,
      },
      {
        date: "2012-12-08",
        value: 78,
      },
      {
        date: "2012-12-09",
        value: 74,
      },
      {
        date: "2012-12-10",
        value: 73,
      },
      {
        date: "2012-12-11",
        value: 75,
      },
      {
        date: "2012-12-12",
        value: 70,
      },
      {
        date: "2012-12-13",
        value: 77,
      },
      {
        date: "2012-12-14",
        value: 67,
      },
      {
        date: "2012-12-15",
        value: 62,
      },
      {
        date: "2012-12-16",
        value: 64,
      },
      {
        date: "2012-12-17",
        value: 61,
      },
      {
        date: "2012-12-18",
        value: 59,
      },
      {
        date: "2012-12-19",
        value: 53,
      },
      {
        date: "2012-12-20",
        value: 54,
      },
      {
        date: "2012-12-21",
        value: 56,
      },
      {
        date: "2012-12-22",
        value: 59,
      },
      {
        date: "2012-12-23",
        value: 58,
      },
      {
        date: "2012-12-24",
        value: 55,
      },
      {
        date: "2012-12-25",
        value: 52,
      },
      {
        date: "2012-12-26",
        value: 54,
      },
      {
        date: "2012-12-27",
        value: 50,
      },
      {
        date: "2012-12-28",
        value: 50,
      },
      {
        date: "2012-12-29",
        value: 51,
      },
      {
        date: "2012-12-30",
        value: 52,
      },
      {
        date: "2012-12-31",
        value: 58,
      },
      {
        date: "2013-01-01",
        value: 60,
      },
      {
        date: "2013-01-02",
        value: 67,
      },
      {
        date: "2013-01-03",
        value: 64,
      },
      {
        date: "2013-01-04",
        value: 66,
      },
      {
        date: "2013-01-05",
        value: 60,
      },
      {
        date: "2013-01-06",
        value: 63,
      },
      {
        date: "2013-01-07",
        value: 61,
      },
      {
        date: "2013-01-08",
        value: 60,
      },
      {
        date: "2013-01-09",
        value: 65,
      },
      {
        date: "2013-01-10",
        value: 75,
      },
      {
        date: "2013-01-11",
        value: 77,
      },
      {
        date: "2013-01-12",
        value: 78,
      },
      {
        date: "2013-01-13",
        value: 70,
      },
      {
        date: "2013-01-14",
        value: 70,
      },
      {
        date: "2013-01-15",
        value: 73,
      },
      {
        date: "2013-01-16",
        value: 71,
      },
      {
        date: "2013-01-17",
        value: 74,
      },
      {
        date: "2013-01-18",
        value: 78,
      },
      {
        date: "2013-01-19",
        value: 85,
      },
      {
        date: "2013-01-20",
        value: 82,
      },
      {
        date: "2013-01-21",
        value: 83,
      },
      {
        date: "2013-01-22",
        value: 88,
      },
      {
        date: "2013-01-23",
        value: 85,
      },
      {
        date: "2013-01-24",
        value: 85,
      },
      {
        date: "2013-01-25",
        value: 80,
      },
      {
        date: "2013-01-26",
        value: 87,
      },
      {
        date: "2013-01-27",
        value: 84,
      },
      {
        date: "2013-01-28",
        value: 83,
      },
      {
        date: "2013-01-29",
        value: 84,
      },
      {
        date: "2013-01-30",
        value: 81,
      },
    ];

    // Set input format for the dates
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value}";
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
        visitor: 1,
        search: 3,
      },
      {
        year: "Feb",
        visitor: 1,
        search: 6,
      },
      {
        year: "Mar",
        visitor: 2,
        search: 1,
      },
      {
        year: "Apr",
        visitor: 3,
        search: 1,
      },
      {
        year: "May",
        visitor: 5,
        search: 2,
      },
      {
        year: "Jun",
        visitor: 3,
        search: 1,
      },
      {
        year: "Jul",
        visitor: 1,
        search: 3,
      },
      {
        year: "Aug",
        visitor: 2,
        search: 5,
      },
      {
        year: "Sept",
        visitor: 3,
        search: 2,
      },
      {
        year: "Oct",
        visitor: 4,
        search: 6,
      },
      {
        year: "Nov",
        visitor: 1,
        search: 4,
      },
    ];

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.opposite = true;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = true;
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

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "unique";
    series2.dataFields.categoryX = "year";
    series2.name = "Unique Visitor";
    series2.bullets.push(new am4charts.CircleBullet());
    series2.tooltipText = "{name}: {valueY}";
    series2.legendSettings.valueText = "{valueY}";

    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = "search";
    series3.dataFields.categoryX = "year";
    series3.name = "Total Search";
    series3.bullets.push(new am4charts.CircleBullet());
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

    let hs3 = series3.segments.template.states.create("hover");
    hs3.properties.strokeWidth = 5;
    series3.segments.template.strokeWidth = 1;

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
        this.filterLABEL = res;
        console.log("label", this.filterLABEL.length);
        label = this.filterLABEL.length;
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );

    console.log(
      "label = ",
      this.filterLABEL.length,
      " serial = ",
      this.filterSERIAL.length,
      " imei = ",
      this.filterIMEI.length,
      "product = ",
      this.filterPRODUCT.length
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
