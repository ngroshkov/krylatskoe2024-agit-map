import * as React from 'react';
import {Map} from "mapbox-gl";
import {AnchorLimits} from "react-mapbox-gl/lib/util/types";

export interface Props {
    position?: AnchorLimits;
    onControlClick?: (map: Map, zoomDiff: number) => void;
}

export interface State {
    hover?: number;
}

export class GeolocateControlNew extends React.Component<Props, State> {
    static defaultProps: {
        position: string;
        onControlClick: (map: Map, zoomDiff: number) => void;
    };

    constructor(props : Props) {
        super(props);
        this.state = {
            hover: undefined
        };
    }

    public render() {
        const positions = {
            'top-right': '10px 10px auto auto',
            'top-left': '10px auto auto 10px',
            'bottom-right': 'auto 10px 10px auto',
            'bottom-left': 'auto auto 10px 10px'
        };
        type ObjectKey = keyof typeof positions;
        const position = positions[this.props.position as ObjectKey]
        const style = {
            position: 'absolute' as 'absolute',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column' as const,
            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            inset: position
        }

        const buttonStyle = {
            backgroundColor: 'rgb(249, 249, 249)',
            opacity: 0.95,
            transition: "background-color 0.16s ease-out 0s",
            cursor: "pointer",
            borderWidth: "0px 0px 0px 0px",
            borderTopStyle: "initial" as const,
            borderRightStyle: "initial" as const,
            borderBottomStyle: "initial" as const,
            borderLeftStyle: "initial" as const,
            borderTopColor: "initial",
            borderRightColor: "initial",
            borderBottomColor: "rgba(0, 0, 0, 0)",
            borderLeftColor: "initial",
            borderImage: "initial",
            height: "26px",
            width: "26px",
            backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='%23333'%3E %3Cpath d='M10 4C9 4 9 5 9 5v.1A5 5 0 0 0 5.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 0 0 9 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 0 0 3.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0 0 11 5.1V5s0-1-1-1zm0 2.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 1 1 0-7z'/%3E %3Ccircle id='dot' cx='10' cy='10' r='2'/%3E %3Cpath id='stroke' d='M14 5l1 1-9 9-1-1 9-9z' display='none'/%3E %3C/svg%3E\")",
            backgroundPosition: "0px 0px",
            backgroundSize: "26px 26px",
            outline: "0px",
            borderTopLeftRadius: "2px",
            borderTopRightRadius: "2px",
            borderBottomLeftRadius: "2px",
            borderBottomRightRadius: "2px",
        }
        return <div style={style}>
            <button style={buttonStyle} />
        </div>
    }

}

