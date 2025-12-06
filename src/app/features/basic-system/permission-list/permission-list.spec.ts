import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionList } from './permission-list';

describe('PermissionList', () => {
  let component: PermissionList;
  let fixture: ComponentFixture<PermissionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
