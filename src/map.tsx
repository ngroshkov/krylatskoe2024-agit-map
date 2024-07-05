import * as React from 'react';
import ReactMapboxGl, {ZoomControl} from 'react-mapbox-gl';
import turfCentroid from '@turf/centroid';
import {FeatureCollection, Feature, Polygon, MultiPolygon, Point} from 'geojson';
import {CityBoundaryLayer, BuildingsLayer, BuildingCentroidsLayer} from './layers';
// import MapiClient from "@mapbox/mapbox-sdk/lib/classes/mapi-client";
import mbxDatasets from "@mapbox/mapbox-sdk/services/datasets";

const accessToken = "pk.eyJ1Ijoia2xuNCIsImEiOiJjaW9sNjZlbWMwMDEwdzVtNmxxYjA2ZGozIn0.BytaphQwtjCVMGEaLlfb3Q";
const Mapbox = ReactMapboxGl({accessToken: accessToken});
const MapiClient = require('@mapbox/mapbox-sdk')
// const mapiClient = new MapiClient({accessToken})
const mapiClient = new MapiClient({accessToken})
const datasetService = mbxDatasets(mapiClient);

const mapProperties = {
    center: [37.420573, 55.737134] as [number, number],
    zoom: [12] as [number],
    pitch: [60] as [number],
    bearing: [0] as [number]
}

const styleId = 'mapbox://styles/kln4/cl65cx61a000c15ljmv271d6d';
const boundaryDatasetId = 'cly4bv93305ub1mocq5fyf8uq';
const buildingDatasetId = 'cly4jnyos8ybp1tnx9skz7oi6';

export interface GpMapProps {
    onClick: any;
}

export interface GpMapState {
    boundary: Feature<Polygon | MultiPolygon>[];
    buildings: Feature<Polygon | MultiPolygon>[];
    hoverBuildings: Feature<Polygon | MultiPolygon>[];
    clickBuildings: Feature<Polygon | MultiPolygon>[];
    buildingCentroids: Feature<Point>[];
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
        datasetService
            .listFeatures({datasetId: boundaryDatasetId})
            .send()
            .then(
                response => {
                    let boundary: FeatureCollection<Polygon | MultiPolygon> = response.body
                    this.setState({boundary: boundary.features})
                },
                error => console.log(error)
        )
        datasetService
            .listFeatures({datasetId: buildingDatasetId})
            .send()
            .then(
                response => {
                    let buildings: FeatureCollection<Polygon | MultiPolygon> = response.body
                    let buildingFeatures = buildings.features
                    let buildingCentroidFeatures = buildings.features
                        .map(feature => turfCentroid(feature))
                    this.setState({
                        buildings: buildingFeatures,
                        buildingCentroids: buildingCentroidFeatures
                    })
                },
                error => console.log(error)
            )
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
            let blds = this.state.buildings
                .filter(feature => feature.properties!.id === id)
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
            {/*<BuildingCentroidsLayer features={this.state.buildingCentroids} circle={true}/>*/}
            {/*<BuildingCentroidsLayer features={this.state.buildingCentroids} symbol={true} />*/}
            <ZoomControl position="top-right"/>
        </Mapbox>
    }
}
