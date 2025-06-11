import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouteDetailsComponent } from './route-details.component';
import { StravaService } from '../../services/strava.service';
import { MetaTagService } from '../../services/meta-tag.service';

describe('RouteDetailsComponent', () => {
  let component: RouteDetailsComponent;
  let fixture: ComponentFixture<RouteDetailsComponent>;
  let stravaServiceMock: any;
  let metaTagServiceMock: any;

  beforeEach(async () => {
    stravaServiceMock = {
      getRoutes: jasmine.createSpy('getRoutes').and.returnValue(of([
        { id_str: '123', name: 'Rota Teste', distance: 100, elevation_gain: 500, map: { url: 'test-map-url' } }
      ]))
    };

    metaTagServiceMock = {
      updateMetaTags: jasmine.createSpy('updateMetaTags')
    };

    await TestBed.configureTestingModule({
      imports: [RouteDetailsComponent],
      providers: [
        { provide: StravaService, useValue: stravaServiceMock },
        { provide: MetaTagService, useValue: metaTagServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '123' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RouteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call updateMetaTags with correct values', () => {
    const baseUrl = window.location.origin;
    expect(metaTagServiceMock.updateMetaTags).toHaveBeenCalledWith({
      title: 'Rota Teste | Trilhas de Franca',
      description: 'Distância: 100km - Elevação: 500m',
      image: 'test-map-url',
      url: `${baseUrl}/rota/123`
    });
  });
});
