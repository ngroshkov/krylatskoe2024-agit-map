import * as React from 'react';
import InteractiveMap, {MapMouseEvent, NavigationControl} from 'react-map-gl';
import turfCentroid from '@turf/centroid';
import {featureCollection} from '@turf/helpers';
import {FeatureCollection, Feature, Polygon, MultiPolygon, Point} from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import {CityBoundaryLayer, BuildingsLayer, ElectionCommissionLayer} from './layers';
import useMapImage from "./image";
// import MapiClient from "@mapbox/mapbox-sdk/lib/classes/mapi-client";
import mbxDatasets from "@mapbox/mapbox-sdk/services/datasets";

import {createRef, useEffect, useState} from "react";
import {Layer} from "mapbox-gl";

const accessToken = "pk.eyJ1Ijoia2xuNCIsImEiOiJjaW9sNjZlbWMwMDEwdzVtNmxxYjA2ZGozIn0.BytaphQwtjCVMGEaLlfb3Q";
const MapiClient = require('@mapbox/mapbox-sdk')
// const mapiClient = new MapiClient({accessToken})
const mapiClient = new MapiClient({accessToken})
const datasetService = mbxDatasets(mapiClient);

const mapProperties = {
    longitude: 37.420573,
    latitude: 55.737134,
    zoom: 12,
    pitch: 60,
    bearing: 0
}

const styleId = 'cl65cx61a000c15ljmv271d6d';
const boundaryDatasetId = 'cly4bv93305ub1mocq5fyf8uq';
const buildingDatasetId = 'cly4jnyos8ybp1tnx9skz7oi6';
const electionCommissionDatasetId = 'clya1iza4qop51mp8z6rjg6l9';

export interface MapProps {
    onClick: (feature: Feature & {layer: Layer}) => void;
}

export default function Map(props: MapProps) {
    const [boundary, setBoundary] = useState(featureCollection([]));
    const [buildings, setBuildings] = useState(featureCollection([]));
    const [electionCommissions, setElectionCommissions] = useState(featureCollection([]));
    const [clickedBuilding, setClickedBuilding] = useState(null);
    const [hoveredBuilding, setHoveredBuilding] = useState(null);
    const [clickedElectionCommission, setClickedElectionCommission] = useState(null);
    const [hoveredElectionCommission, setHoveredElectionCommission] = useState(null);

    useEffect(() => {
        datasetService
            .listFeatures({datasetId: boundaryDatasetId})
            .send()
            .then(
                response => {
                    let features: FeatureCollection<Polygon | MultiPolygon> = response.body
                    setBoundary(features)
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
                    let buildingCentroidFeatures = buildingFeatures
                        .map(feature => turfCentroid(feature))
                    setBuildings(buildings)
                },
                error => console.log(error)
            )
        datasetService
            .listFeatures({datasetId: electionCommissionDatasetId})
            .send()
            .then(
                response => {
                    let features: FeatureCollection<Point> = response.body
                    setElectionCommissions(features)
                },
                error => console.log(error)
            )
    }, []);

    const mapRef = createRef();
    useMapImage({mapRef, name: 'star', url: process.env.PUBLIC_URL + "/img/star.png"})
    useMapImage({mapRef, name: 'star-stroked', url: process.env.PUBLIC_URL + "/img/star-stroked.png"})

    let handleEnter = (event: MapMouseEvent) => {
        let buildingFeature = event?.features?.find(f => f.layer.id === 'buildings') || null
        let electionCommissionFeature = event?.features?.find(f => f.layer.id === 'electionCommissions') || null
        setHoveredBuilding(buildingFeature)
        setHoveredElectionCommission(electionCommissionFeature)
    }

    let handleLeave = () => {
        setHoveredBuilding(null)
        setHoveredElectionCommission(null)
    }

    let handleClick = (event: MapMouseEvent) => {
        let buildingFeature = event?.features?.find(f => f.layer.id === 'buildings') || null
        let electionCommissionFeature = event?.features?.find(f => f.layer.id === 'electionCommissions') || null
        props.onClick(buildingFeature || electionCommissionFeature)
        setClickedBuilding(buildingFeature)
        setClickedElectionCommission(electionCommissionFeature)
        setHoveredBuilding(null)
        setHoveredElectionCommission(null)
    }

    return (
        <InteractiveMap
            mapboxAccessToken={accessToken}
            initialViewState={mapProperties}
            style={{
                position: 'absolute',
                height: '100%',
                width: '100%'
            }}
            mapStyle={`mapbox://styles/kln4/${styleId}`}
            interactiveLayerIds={["buildings", "electionCommissions"]}
            onClick={handleClick}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            ref={mapRef as any}
        >
            <NavigationControl/>
            <CityBoundaryLayer featureCollection={boundary as FeatureCollection<Polygon | MultiPolygon>}/>
            <BuildingsLayer featureCollection={buildings as FeatureCollection<Polygon | MultiPolygon>}
                            clicked={clickedBuilding}
                            hovered={hoveredBuilding}
            />
            <ElectionCommissionLayer featureCollection={electionCommissions as FeatureCollection<Point>}
                                     clicked={clickedElectionCommission}
                                     hovered={hoveredElectionCommission}
            />
        </InteractiveMap>
    )
}