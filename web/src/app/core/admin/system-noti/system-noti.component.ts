import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EmailNotiService } from 'src/app/shared/services/emailNoti/emailNoti.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-system-noti',
  templateUrl: './system-noti.component.html',
  styleUrls: ['./system-noti.component.scss']
})
export class SystemNotiComponent implements OnInit {

  editEnabled: boolean = false
  emailForm: FormGroup
  searchNOTIForm: FormGroup
  editForm = {email:"", Id:''}
  infoTable = []

  private chart: any
  private chart1: any
  private chart2: any

  constructor(
    private formBuilder: FormBuilder,
    private EmailNotiService: EmailNotiService,
    private zone: NgZone
  ) { 
    this.productGeneration()
  }

  ngOnInit() {
    this.getCharts() 

    // this.editForm = this.formBuilder.group({
    //   Id: new FormControl(""),
    //   email: new FormControl(""),
    // });
  }


  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose()
      }
      if (this.chart1) {
        this.chart1.dispose()
      }
      if (this.chart2) {
        this.chart2.dispose()
      }
    })
  }

  getCharts() {
    this.zone.runOutsideAngular(() => {
      this.getChart()
      this.getChart1()
      this.getChart2()
    })
  }

  getChart() {
    let chart = am4core.create("pieNoti", am4charts.PieChart);

    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      {
        item: "used",
        value: 45
      },
      {
        item: "Unused",
        value: 55
      },
      
    ];
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

    this.chart = chart
    
  } 

  getChart1() {
    let chart = am4core.create("pieChartNoti", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      {
        item: "Performance",
        value: 100
      },
      
    ];
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

    //chart.legend = new am4charts.Legend();
    this.chart1 = chart  
  }

  getChart2(){
    let chart = am4core.create("bounceNoti", am4charts.XYChart);
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

  productGeneration() {
    
    this.EmailNotiService.get().subscribe(
      (res) => {
        this.infoTable=res
        console.log("wewe",this.infoTable)
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => console.log("HTTP request completed.")
    );
  }

  dropdownFAQ(event){
    console.log('event = ',event)
    this.EmailNotiService.getOne(event).subscribe(
      (res) => {
        this.editForm.email = res.email
        this.editForm.Id = res.Id
        // this.editFAQ.categoryId = res.categoryId
        // this.editForm.patchValue(res)
        console.log(res)

      },
      () => {
        console.log("HTTP request completed.")
      }
    );
  }

}
