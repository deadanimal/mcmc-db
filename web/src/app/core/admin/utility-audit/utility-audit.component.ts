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
  SLPTable = [];
  VisitorGetTable = []
  productCertificationTable = []
  IMEITable = []
  SerialTable = []
  array = []

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
    this.productCertificationGet()
    this.CounterSearchGet()
  }

  history(){
    this.subscription = forkJoin([
      this.faqCategoriesService.getHistory(),
      this.faqCategoriesService.getHistory2()
    ]).subscribe(
      (res)=>{
        this.array = res
        let arrayZero = []
        let arrayOne = []
        // Let arrayTwo = []
        // let rangeArray = []

        arrayZero=res[0]
        arrayOne= res[1]
        this.array = [...arrayZero,...arrayOne]
        console.log("gabungan", this.array)
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
  }

  productCertificationGet() {
    this.productCertificationService.get().subscribe(
      (res) => {
        this.productCertificationTable = res;
        console.log(this.productCertificationTable.length);
      },
      (err) => {},
      () => {
        console.log("HTTP request completed.");
      }
    );
  }

  CounterSearchGet() {
    let imei = "RegType=IMEI";
    this.productGenerationService.filter(imei).subscribe(
      (res) => {
        this.IMEITable = res;
        console.log(this.IMEITable.length);
      },
      (err) => {},
      () => {}
    );

    let serial = "RegType=SerialNo";
    this.productGenerationService.filter(serial).subscribe(
      (res) => {
        this.SerialTable = res;
        console.log(this.SerialTable.length);
      },
      (err) => {},
      () => {}
    );
  }
}
