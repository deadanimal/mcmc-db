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
am4core.useTheme(am4themes_animated);

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
  chart: any;
  chart1: any;
  chart2: any;
  chart3: any;
  chart4: any;
  dataChart: any[] = [];
  dataChart2: any[] = [];
  dataChart3: any[] = [];
  user: any;

  tableEntries: number = 5;
  tableSelected: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  SelectionType = SelectionType;
  infoTable = [];
  CounterTable = [];
  SLPTable = [];
  IMEITable = [];
  SerialTable = [];
  CertTable = [];
  filterIMEI = [];
  filterSERIAL = [];
  filterPRODUCT = [];
  filterLABEL = [];
  VisitorGetTable = [];
  dataSearchForm: FormGroup;

  state: boolean = false;
  isSummaryTableHidden: boolean = true;
  fileName = "MasterTable.xlsx";

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
    this.productGeneration();
    this.VisitorCounterGet();
    this.CounterSearchGet();
    this.calculateCharts();
    setTimeout(() => {
      this.getData();
      this.getChart3();
    }, 5000);
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
    this.mockService.getAll("admin-report/report-data-1.json").subscribe(
      (res) => {
        // Success
        this.dataChart = res;
      },
      () => {
        // Unsuccess
      },
      () => {
        // After
        this.mockService.getAll("admin-report/report-data-2.json").subscribe(
          (res) => {
            // Success
            this.dataChart2 = res;
          },
          () => {
            // Unsuccess
          },
          () => {
            // After
            this.mockService
              .getAll("admin-report/report-data-3.json")
              .subscribe(
                (res) => {
                  // Success
                  this.dataChart3 = res;
                },
                () => {
                  // Unsuccess
                },
                () => {
                  // After
                  this.getCharts();
                }
              );
          }
        );
      }
    );
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
      this.getChart();
      this.getChart1();
      this.getChart2();
      // this.MasterChart();
    });
  }

  getChart() {
    let chart = am4core.create("visitorChart", am4charts.XYChart);
    chart.paddingRight = 20;

    let data = this.dataChart;

    chart.data = data;
    chart.dateFormatter.inputDateFormat = "yyyy";

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.baseInterval = { timeUnit: "year", count: 2 };

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;

    let series = chart.series.push(new am4charts.StepLineSeries());
    series.dataFields.dateX = "year";
    series.dataFields.valueY = "amount";
    series.tooltipText = "{valueY.amount}";
    series.strokeWidth = 3;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.cursor.fullWidthLineX = true;
    chart.cursor.lineX.strokeWidth = 0;
    chart.cursor.lineX.fill = chart.colors.getIndex(2);
    chart.cursor.lineX.fillOpacity = 0.1;

    this.chart = chart;
  }

  getChart1() {
    let chart = am4core.create("totalDataChart", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    let data = [];
    let open = 100;
    let close = 250;

    for (var i = 1; i < 120; i++) {
      open += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 4);
      close = Math.round(
        open +
          Math.random() * 5 +
          i / 5 -
          (Math.random() < 0.5 ? 1 : -1) * Math.random() * 2
      );
      data.push({ date: new Date(2018, 0, i), open: open, close: close });
    }

    chart.data = data;
    console.log("-----------");

    console.log("show data", this.chart.data);
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.openValueY = "open";
    series.dataFields.valueY = "close";
    series.tooltipText = "open: {openValueY.value} close: {valueY.value}";
    series.sequencedInterpolation = true;
    series.fillOpacity = 0.3;
    series.defaultState.transitionDuration = 1000;
    series.tensionX = 0.8;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = "date";
    series2.dataFields.valueY = "open";
    series2.sequencedInterpolation = true;
    series2.defaultState.transitionDuration = 1500;
    series2.stroke = chart.colors.getIndex(6);
    series2.tensionX = 0.8;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

    this.chart1 = chart;
  }

  getChart2() {
    let chart = am4core.create("systemChart", am4charts.XYChart);

    // Add data
    chart.data = this.dataChart2;

    // Create axes
    let valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxisX.title.text = "X Axis";
    valueAxisX.renderer.minGridDistance = 40;

    // Create value axis
    let valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisY.title.text = "Y Axis";

    // Create series
    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = "ay";
    lineSeries.dataFields.valueX = "ax";
    lineSeries.strokeOpacity = 0;

    let lineSeries2 = chart.series.push(new am4charts.LineSeries());
    lineSeries2.dataFields.valueY = "by";
    lineSeries2.dataFields.valueX = "bx";
    lineSeries2.strokeOpacity = 0;

    // Add a bullet
    let bullet = lineSeries.bullets.push(new am4charts.Bullet());

    // Add a triangle to act as am arrow
    let arrow = bullet.createChild(am4core.Triangle);
    arrow.horizontalCenter = "middle";
    arrow.verticalCenter = "middle";
    arrow.strokeWidth = 0;
    arrow.fill = chart.colors.getIndex(0);
    arrow.direction = "top";
    arrow.width = 12;
    arrow.height = 12;

    // Add a bullet
    let bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());

    // Add a triangle to act as am arrow
    let arrow2 = bullet2.createChild(am4core.Triangle);
    arrow2.horizontalCenter = "middle";
    arrow2.verticalCenter = "middle";
    arrow2.rotation = 180;
    arrow2.strokeWidth = 0;
    arrow2.fill = chart.colors.getIndex(3);
    arrow2.direction = "top";
    arrow2.width = 12;
    arrow2.height = 12;

    //add the trendlines
    let trend = chart.series.push(new am4charts.LineSeries());
    trend.dataFields.valueY = "value2";
    trend.dataFields.valueX = "value";
    trend.strokeWidth = 2;
    trend.stroke = chart.colors.getIndex(0);
    trend.strokeOpacity = 0.7;
    trend.data = [
      { value: 1, value2: 2 },
      { value: 12, value2: 11 },
    ];

    let trend2 = chart.series.push(new am4charts.LineSeries());
    trend2.dataFields.valueY = "value2";
    trend2.dataFields.valueX = "value";
    trend2.strokeWidth = 2;
    trend2.stroke = chart.colors.getIndex(3);
    trend2.strokeOpacity = 0.7;
    trend2.data = [
      { value: 1, value2: 1 },
      { value: 12, value2: 19 },
    ];

    this.chart2 = chart;
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
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
  }

  getChart3() {
    let chart = am4core.create("totalSearch", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

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
    chart.endAngle = 180;

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

    this.chart3 = chart;
  }

  MasterChart() {
    let chart = am4core.create("MasterGraphChart", am4charts.XYChart);

    // Add data
    // chart.data = [
    //   {
    //     year: "Jan",
    //     visitor: this.visitorbymonth['january'],
    //     search: this.searchbymonth['january'],
    //   },
    //   {
    //     year: "Feb",
    //     visitor: this.visitorbymonth['february'],
    //     search: this.searchbymonth['february'],
    //   },
    //   {
    //     year: "Mar",
    //     visitor: this.visitorbymonth['march'],
    //     search: this.searchbymonth['march'],
    //   },
    //   {
    //     year: "Apr",
    //     visitor: this.visitorbymonth['april'],
    //     search: this.searchbymonth['april'],
    //   },
    //   {
    //     year: "May",
    //     visitor: this.visitorbymonth['may'],
    //     search: this.searchbymonth['may'],
    //   },
    //   {
    //     year: "Jun",
    //     visitor: this.visitorbymonth['june'],
    //     search: this.searchbymonth['june'],
    //   },
    //   {
    //     year: "Jul",
    //     visitor: this.visitorbymonth['july'],
    //     search: this.searchbymonth['july'],
    //   },
    //   {
    //     year: "Aug",
    //     visitor: this.visitorbymonth['august'],
    //     search: this.searchbymonth['august'],
    //   },
    //   {
    //     year: "Sept",
    //     visitor: this.visitorbymonth['september'],
    //     search: this.searchbymonth['september'],
    //   },
    //   {
    //     year: "Oct",
    //     visitor: this.visitorbymonth['october'],
    //     search: this.searchbymonth['october'],
    //   },
    //   {
    //     year: "Nov",
    //     visitor: this.visitorbymonth['november'],
    //     search: this.searchbymonth['november'],
    //   },
    // ];

    chart.data = [{
      "year": "1930",
      "IMEI": 1,
      "TAC": 5,
      "Serial": 3
    }, {
      "year": "1934",
      "IMEI": 1,
      "TAC": 2,
      "Serial": 6
    }, {
      "year": "1938",
      "IMEI": 2,
      "TAC": 3,
      "Serial": 1
    }, {
      "year": "1950",
      "IMEI": 3,
      "TAC": 4,
      "Serial": 1
    }, {
      "year": "1954",
      "IMEI": 5,
      "TAC": 1,
      "Serial": 2
    }, {
      "year": "1958",
      "IMEI": 3,
      "TAC": 2,
      "Serial": 1
    }, {
      "year": "1962",
      "IMEI": 1,
      "TAC": 2,
      "Serial": 3
    }, {
      "year": "1966",
      "IMEI": 2,
      "TAC": 1,
      "Serial": 5
    }, {
      "year": "1970",
      "IMEI": 3,
      "TAC": 5,
      "Serial": 2
    }, {
      "year": "1974",
      "IMEI": 4,
      "TAC": 3,
      "Serial": 6
    }, {
      "year": "1978",
      "IMEI": 1,
      "TAC": 2,
      "Serial": 4
    }];

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.opposite = false;

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

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "IMEI";
    series2.dataFields.categoryX = "year";
    series2.name = "IMEI";
    series2.bullets.push(new am4charts.CircleBullet());
    series2.tooltipText = "{name}: {valueY}";
    series2.legendSettings.valueText = "{valueY}";

    let series3 = chart.series.push(new am4charts.ColumnSeries());
    series3.dataFields.valueY = "Serial";
    series3.dataFields.categoryX = "year";
    series3.name = "Serial";
    series3.tooltipText = "{name}: {valueY}";
    series3.legendSettings.valueText = "{valueY}";

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
    setTimeout(() => {
      this.MasterChart()
    }, 3000);
  };

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
