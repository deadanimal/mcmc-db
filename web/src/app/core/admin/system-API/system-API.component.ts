import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import swal from 'sweetalert2';
import { MocksService } from 'src/app/shared/services/mocks/mocks.service';
import { ProductGenerationService } from 'src/app/shared/services/ProductRegistration/ProductGeneration.service';
import { emailTemplateService } from 'src/app/shared/services/emailTemplate/emailTemplate.service';


am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-system-API',
  templateUrl: './system-API.component.html',
  styleUrls: ['./system-API.component.scss']
})
export class SystemAPIComponent implements OnInit, OnDestroy {

  private chart: any
  private chart1: any
  private chart2: any
  tableTemp = [];
  tableRows = [];

  constructor(
    private zone: NgZone,
    private loadingBar: LoadingBarService,
    private mockService: MocksService,
    private productGenerationService: ProductGenerationService,
    private emailTemplateService: emailTemplateService,
  ) { }

  ngOnInit() {
    this.getCharts()
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart2) {
        this.chart2.dispose()
      }
    })
  }

  getData() {
    this.loadingBar.start(); 
    this.mockService.getAll('dummy-api/serial.json').subscribe(
      (res) => {
        // Success
        this.tableRows = [...res]
        console.log("wewe",this.tableRows.length);
        this.tableTemp = this.tableRows.map((prop, key) => {
          return {
            ...prop,
            id: key
          };
        });
        // console.log
        this.loadingBar.complete();
      },
      () => {
        // Unsuccess
      },
      () => {
          swal.fire({
            title: "API Call",
            text: "Data is successfully retrieved!",
            type: "info",
            confirmButtonClass: "btn btn-info",
            confirmButtonText: "Add Data",
            showCancelButton: true,
            cancelButtonClass: "btn btn-danger",
            cancelButtonText: "Cancel"
            }).then((result) => {
              if (result.value) {
                this.NewData()
                this.testSendEmail()
              }
              })  
      })
  }

  NewData() {
    console.log()
    this.tableRows.forEach(
      ((row) => {
        this.productGenerationService.post(row).subscribe(
          () => {
            // Success
            // this.isLoading = false
            // this.successMessage();
            // this.loadingBar.complete();
            // this.successAlert("create project");
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
      })
      )
  }

  getCharts() {
    this.zone.runOutsideAngular(() => {
      this.getChart2()
    })
  }

  getChart2(){
    let chart = am4core.create("bounce", am4charts.XYChart);
    chart.paddingRight = 20;

    chart.data = generateChartData();

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
      "timeUnit": "minute",
      "count": 1
    };
    dateAxis.tooltipDateFormat = "HH:mm, d MMMM";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = false;
    // valueAxis.title.text = "Unique visitors";

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "visits";
    series.tooltipText = "Visits: [bold]{valueY}[/]";
    series.fillOpacity = 0.3;


    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.opacity = 0;

    dateAxis.start = 0.8;
    dateAxis.keepSelection = true;

    function generateChartData() {
        let chartData = [];
        // current date
        let firstDate = new Date();
        // now set 500 minutes back
        firstDate.setMinutes(firstDate.getDate() - 500);

        // and generate 500 data items
        let visits = 500;
        for (var i = 0; i < 500; i++) {
            let newDate = new Date(firstDate);
            // each time we add one minute
            newDate.setMinutes(newDate.getMinutes() + i);
            // some random number
            visits += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
            // add data item to the array
            chartData.push({
                date: newDate,
                visits: visits
            });
        }
        return chartData;
    }
    this.chart2 = chart
  }

  testSendEmail(){
    let obj
    console.log("Send Email function")
    this.emailTemplateService.sending_mail(obj).subscribe(
      (res) => {
        // console.log("res", res);
      },
      (err) => {
        console.error("err", err);
      }
    );
  }

}
