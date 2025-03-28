/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SerialComponent } from './serial.component';

describe('SerialComponent', () => {
  let component: SerialComponent;
  let fixture: ComponentFixture<SerialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
