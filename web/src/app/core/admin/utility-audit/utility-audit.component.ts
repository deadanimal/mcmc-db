import { ProductGenerationService } from 'src/app/shared/services/ProductRegistration/ProductGeneration.service';
import { productCertificationService } from 'src/app/shared/services/productCertification/productCertification.service';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { forkJoin, Subscription } from "rxjs";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { FAQCategoriesService } from 'src/app/shared/services/FAQCategories/FAQCategories.service';
import { VisitorCounterService } from 'src/app/shared/services/VisitorCounter/VisitorCounter.service';

am4core.useTheme(am4themes_animated);

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: 'app-utility-audit',
  templateUrl: './utility-audit.component.html',
  styleUrls: ['./utility-audit.component.scss']
})
export class UtilityAuditComponent implements OnInit {

  private chart: any
  dataHistory
  dataHistory2
  VisitorGetTable = []
  array = []
  TACData = []
  IMEIData = []
  serialData = []

  // Table
  tableEntries: number = 5
  tableSelected: any[] = []
  tableTemp = []
  tableActiveRow: any
  tableRows: any[] = []
  SelectionType = SelectionType
  entries: number = 10

  subscription: Subscription

  constructor(
    private zone: NgZone,
    private faqCategoriesService: FAQCategoriesService,
    private visitorCounterService: VisitorCounterService,
    private productCertificationService: productCertificationService,
    private productGenerationService :ProductGenerationService
  ) { }

  ngOnInit() {
    this.history()
    this.VisitorCounterGet()
  }

  history(){
    this.subscription = forkJoin([
      this.faqCategoriesService.getHistory(),
      this.faqCategoriesService.getHistory2(),
      this.faqCategoriesService.getHistory3(),
      this.faqCategoriesService.getHistory4(),
      this.faqCategoriesService.getHistory5(),
    ]).subscribe(
      (res)=>{
        let arrayZero = []
        let arrayOne = []
        let arrayTwo = []
        let arrayThree = []
        let arrayFour = []
        // let rangeArray = []

        arrayZero = res[0]
        arrayOne = res[1]
        arrayTwo = res[2]
        arrayThree = res[3]
        arrayFour = res[4]
        this.array = [...arrayZero,...arrayOne,...arrayTwo,...arrayThree,...arrayFour]
        this.array.sort((x,y) => +new Date(y.history_date) - +new Date(x.history_date))
      },
      (err) =>{
        console.log("error", err)
      }
    )
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  VisitorCounterGet() {
    this.visitorCounterService.get().subscribe(
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

}
