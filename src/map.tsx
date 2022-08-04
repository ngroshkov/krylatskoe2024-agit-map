import * as React from 'react';
import ReactMapboxGl, {ZoomControl} from 'react-mapbox-gl';

import {CityBoundaryLayer, BuildingsLayer, BuildingCentroidsLayer} from './layers';

const accessToken = "pk.eyJ1Ijoia2xuNCIsImEiOiJjaW9sNjZlbWMwMDEwdzVtNmxxYjA2ZGozIn0.BytaphQwtjCVMGEaLlfb3Q";
const Mapbox = ReactMapboxGl({accessToken: accessToken});
const MapboxClient = require('mapbox');
const mapbox = new MapboxClient(accessToken);

const mapProperties = {
    center: [37.79929327748674, 55.79452505631096] as [number, number],
    zoom: [14.5] as [number],
    pitch: [0] as [number],
    bearing: [0] as [number]
}

const styleId = 'mapbox://styles/kln4/cl65cx61a000c15ljmv271d6d';
const boundaryDatasetId = 'cl65d7hdn045l22qotk8e13ok';
const buildingDatasetId = 'cl66oxjy700vc2bqod4x9l5hx';
const buildingCentroidsId = 'cl6dx5mbl07tb2emp8ioiitp7';

export interface GpMapProps {
    onClick: any;
}

export interface GpMapState {
    boundary: GeoJSON.Feature<GeoJSON.GeometryObject>[];
    buildings: GeoJSON.Feature<GeoJSON.GeometryObject>[];
    hoverBuildings: GeoJSON.Feature<GeoJSON.GeometryObject>[];
    clickBuildings: GeoJSON.Feature<GeoJSON.GeometryObject>[];
    buildingCentroids: GeoJSON.Feature<GeoJSON.GeometryObject>[];
}

export default class GpMap extends React.Component<GpMapProps, GpMapState> {
    constructor(props: GpMapProps) {
        super(props);
        this.state = {
            boundary: [],
            buildings: [],
            hoverBuildings: [],
            clickBuildings: [],
            buildingCentroids: []
        };
    }

    public componentDidMount() {
        mapbox.listFeatures(boundaryDatasetId, {}, (err: any, boundary: GeoJSON.FeatureCollection<GeoJSON.GeometryObject>) => {
            this.setState({boundary: boundary.features});
        });
        mapbox.listFeatures(buildingDatasetId, {}, (err: any, buildings: GeoJSON.FeatureCollection<GeoJSON.GeometryObject>) => {
            this.setState({buildings: buildings.features});
        });
        mapbox.listFeatures(buildingCentroidsId, {}, (err: any, buildingCentroids: GeoJSON.FeatureCollection<GeoJSON.GeometryObject>) => {
            this.setState({buildingCentroids: buildingCentroids.features});
        });
    }

    private handleBuildingsEnter = (e: any) => {
        let id = e.features[0].properties.id
        let blds = this.state.buildings.filter(feature => feature.properties!.id === id)
        this.setState({hoverBuildings: blds});
    }

    private handleBuildingsLeave = () => {
        this.setState({hoverBuildings: []});
    }

    private handleBuildingsClick = (e: any) => {
        if (e == null) {
            this.props.onClick(null)
            this.setState({clickBuildings: []});
        } else {
            let id = e.features[0].properties.id
            let properties = e.features[0].properties
            this.props.onClick(properties)
            let blds = this.state.buildings.filter(feature => feature.properties!.id === id)
            this.setState({clickBuildings: blds});
        }
    }

    public render() {
        return <Mapbox
            style={styleId}
            center={mapProperties.center}
            zoom={mapProperties.zoom}
            pitch={mapProperties.pitch}
            bearing={mapProperties.bearing}
            containerStyle={{
                position: 'absolute',
                height: '100%',
                width: '100%'
            }}
            onClick={() => this.handleBuildingsClick(null)}
        >
            <CityBoundaryLayer features={this.state.boundary}/>
            <BuildingsLayer
                features={this.state.buildings}
                opacity={0.5}
                onBuildingsMouseEnter={this.handleBuildingsEnter}
                onBuildingsMouseLeave={this.handleBuildingsLeave}
                onBuildingsClick={this.handleBuildingsClick}
            />
            <BuildingsLayer features={this.state.hoverBuildings} opacity={0.8}/>
            <BuildingsLayer features={this.state.clickBuildings} opacity={1}/>
            <BuildingCentroidsLayer features={this.state.buildingCentroids} circle={true}/>
            <BuildingCentroidsLayer features={this.state.buildingCentroids} symbol={true} />
            <ZoomControl position="top-left"/>
        </Mapbox>
    }
}
