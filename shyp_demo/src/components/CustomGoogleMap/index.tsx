import React, { PureComponent } from 'react'
import { compose, withProps } from "recompose"
import moment from 'moment'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline, InfoWindow } from "react-google-maps"
import { ProgressLine } from '../';


import * as boatIcon from "../../assets/images/map_overview/boat_icon.png"
import * as smallBoatIcon from "../../assets/images/map_overview/boat_small_icon.png"
import * as airIcon from "../../assets/images/map_overview/air_icon.svg"
import * as smallAirIcon from "../../assets/images/map_overview/air_small_icon.svg"
import * as startMarker from "../../assets/images/map_overview/start_marker.svg"
import * as endMarker from "../../assets/images/map_overview/end_marker.svg"

import './styles.scss';



interface ICustomGoogleMapOriginalProps{
  markers: IMarker[];
}

interface ICustomGoogleMapProps extends ICustomGoogleMapOriginalProps{
  markers: IMarker[];
}

interface ICustomGoogleMapState {
  markers: IMarker[],
}

interface IShipment{
  current_estimated_arrival: string;
  days_to_arrival: number;
  delayed_days: number;
  discharge_port: string;
  discharge_port_code: string;
  discharge_port_country: string;
  estimated_arrival: string;
  estimated_departure: string;
  id: number;
  loading_port: string;
  loading_port_code: string;
  loading_port_country: string;
  progress_percent: number
  reference_number: string;
  shipment_type: string;
  title: string;
  updated_estimated_arrival: string;
  valid_information: boolean
}

interface IMarker {
  current_position: object;
  latitude: string;
  longitude: string;
  route: any;
  shipment_code: string;
  shipment_content: any;
  type: string;
  isOpen: boolean | null;
}

const defaultMapOptions = {
  center: {lat: 25.207, lng: 36.158},
  zoom: 2,
  hugeWindow: 5,
  smallWindow: 15,
  noTooltips: 30,
};

const MyMapComponent = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDxrDk-wuk4D_SikAMVYoxsFh1uLdQKLC0&language=en&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `80vh`, marginTop: '15px' }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap,
)((props) => {
  return (
    <GoogleMap
      defaultZoom={defaultMapOptions.zoom}
      defaultCenter={defaultMapOptions.center}
      defaultMapTypeId='custom_style'
      defaultExtraMapTypes={[['custom_style', new google.maps.StyledMapType([
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8ec3b9"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1a3646"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#4b6878"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#64779e"
            }
          ]
        },
        {
          "featureType": "administrative.province",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#4b6878"
            }
          ]
        },
        {
          "featureType": "landscape.man_made",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#334e87"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#023e58"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#283d6a"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#6f9ba5"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#023e58"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#3C7680"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#304a7d"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#98a5be"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#2c6675"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#255763"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#b0d5ce"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#023e58"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#98a5be"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#283d6a"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#3a4762"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#0e1626"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#4e6d70"
            }
          ]
        }
      ], {name: 'Custom Style'})]]}
      defaultOptions={{
        disableDefaultUI: true,
        scrollwheel: false,
        draggable: true,
        zoomControl: true
      }}
    >
      {props.markersData}
    </GoogleMap>
  )
});


function mouseOver(this: any) { this.setOptions({strokeOpacity: 0.5})}
function mouseOut(this: any) { this.setOptions({strokeOpacity: 0})}

class CustomGoogleMap extends PureComponent<ICustomGoogleMapProps, ICustomGoogleMapState> {

  constructor (props, context) {
    super(props, context);
    this.state = {
      markers: props.markers
    };
  }

  public componentWillReceiveProps(nextProps) {
    this.setState({markers: nextProps.markers});
  }

  public onMarkerClick(index: number) {
    this.state.markers[index].isOpen = !this.state.markers[index].isOpen;
    this.setState({markers: this.state.markers}, ()=>{ this.forceUpdate() });
  }

  public render () {
    return (
      <MyMapComponent markersData={this.renderMarkers()} />
    );
  }

  private _renderSmallInfoWindow(mapItem: IMarker) {
    return <InfoWindow>
      <div className="small-info-window">
        {
          mapItem.shipment_content.shipments.map((shipment: IShipment, i: number) => {
            return (
              <div key={i}>
                <a href={`/shipments/${shipment.id}/edit`} className="small-info-window__shipment-link" target="_blank">{shipment.title}</a>
              </div>
            )
          })
        }
      </div>
    </InfoWindow>
  }

  private _renderInfoWindow(mapItem: IMarker) {
    const shipment = mapItem.shipment_content.shipments[0];
    let block;
    if (shipment.current_estimated_arrival) {
      block = (
        <div className="info-window__body--progress-bar">
          <div className="line-container">
            <ProgressLine percent={shipment.progress_percent}/>
          </div>

          <span className="days">
            {`${shipment.days_to_arrival} days`}
            <span className={'delay ' + (shipment.updated_estimated_arrival < shipment.estimated_arrival ? 'green' : 'red')}>
              {shipment.delayed_days || ''}
            </span>
          </span>
        </div>
      )
    }

    return <InfoWindow defaultZIndex={999}>
      <div className="info-window">
        {
          mapItem.shipment_content.shipments.map((shipmentInstance: IShipment, i: number) => {
            return (
              <div key={i} className="info-window__title">
                <a href={`/shipments/${shipmentInstance.id}/edit`} className="info-window__title--link" target="_blank">
                  <span className="info-window__title--link--text">
                    {shipmentInstance.title}
                    <i className={`info-window__title--link--text--icon icon ${shipmentInstance.valid_information ? 'checked' : 'attention'}`}/>
                  </span>
                  <span className="info-window__title--link--reference">
                    {(shipmentInstance.reference_number || '-').substring(0, 30)}
                  </span>
                </a>
              </div>
            )
          })
        }
        <div className="info-window__body">
          <div className="info-window__body--date-block">
            <span>{moment(shipment.estimated_departure).format('MMM D')}</span>
            <span className="info-window__body--date-block__port-code">{shipment.loading_port_code}</span>
          </div>
          {block}
          <div className="info-window__body--date-block">
            <span>{shipment.current_estimated_arrival ? moment(shipment.current_estimated_arrival).format('MMM D') : ''}</span>
            <span className="info-window__body--date-block__port-code">{shipment.discharge_port_code}</span>
          </div>
        </div>
      </div>
    </InfoWindow>
  }

  private customMarker(index: number, marker: IMarker) {
    if (!marker.latitude || !marker.longitude) {
      return;
    }

    const markersCount = this.state.markers.length;
    const  size = markersCount > defaultMapOptions.noTooltips ? 'small' : 'normal';
    let smallInfoWindow;
    let infoWindow;
    let icon = marker.type === 'sea' ? boatIcon : airIcon;
    if (size === 'small') {
      icon = marker.type === 'sea' ? smallBoatIcon : smallAirIcon;
    }

    if (marker.isOpen) {
      infoWindow = this._renderInfoWindow(marker);
    } else if (marker.isOpen === false) {
      infoWindow = null;
      smallInfoWindow = null;
    } else {
      if (markersCount < defaultMapOptions.hugeWindow) {
        infoWindow = this._renderInfoWindow(marker);
      } else if (markersCount < defaultMapOptions.smallWindow) {
        smallInfoWindow = this._renderSmallInfoWindow(marker);
      }
    }

    return (
      <Marker
        key={index}
        defaultIcon={icon}
        position={{ lat: parseFloat(marker.latitude), lng: parseFloat(marker.longitude) }}
        onClick={this.onMarkerClick.bind(this, index)}
      >
        {infoWindow}
        {smallInfoWindow}
      </Marker>
    )
  }

  private renderMarkers() {
    return this.state.markers.map((marker: IMarker, i: number) => {
      return [
        this.customMarker(i, marker),
        <Marker
          key={`${i}start_marker`}
          defaultIcon={startMarker}
          position={marker.route[0]}
        />,
        <Marker
          key={`${i}end_marker`}
          defaultIcon={endMarker}
          position={marker.route[marker.route.length - 1]}
        />,
        <Polyline
          key={`${i}polyline`}
          path={marker.route}
          defaultOptions={{
            strokeColor: '#22acfc',
            strokeOpacity: 0,
            icons: [{
              icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 2
              },
              offset: '0',
              repeat: '10px'
            }
            ],
            strokeWeight: 10
          }}
          onMouseOver={mouseOver}
          onMouseOut={mouseOut}
        />]
    })
  }
}

export default CustomGoogleMap;
