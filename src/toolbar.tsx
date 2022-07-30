import * as React from 'react';

export interface ToolbarProps {
    properties: any
}

export interface ToolbarValueProps {
    value: string;
}

function Toolbar(props: ToolbarProps) {
    const style = {
        position: 'absolute' as 'absolute',
        left: '5px',
        right: '5px',
        bottom: '5px',
        height: '200px',
        backgroundColor: 'white',
        borderRadius: '10px',
        opacity: 0.9,
        textAlign: 'center' as const,
        padding: '15px'
    };
    return (<div style={style}>
            <table style={{width: '100%'}}>
                <tbody>
                <tr>
                    <th colSpan={2}>
                        <h3 style={{margin: '0px'}}>
                            <b>Адрес:</b>
                            {props.properties != null ? props.properties['address:address'] : ""}
                        </h3>
                    </th>
                </tr>
                <tr style={{textAlign: "left" as const}}>
                    <td style={{padding: "5px", verticalAlign: "top" as const}}>
                        <b>УИК:</b> {props.properties != null ? <span>№ {props.properties['address:uik']}</span> : ""}<br/>
                        <b>Кол-во жителей:</b> {props.properties != null ? <span>{props.properties['address:residents']}</span> : ""}<br/>
                        <b>Кол-во квартир:</b> {props.properties != null ? <span>{props.properties['address:apartments']}</span> : ""}<br/>
                        <b>Кол-во подъездов:</b> {props.properties != null ? <span>{props.properties['address:halls']}</span> : ""}<br/>
                    </td>
                    <td style={{padding: "5px", verticalAlign: "top" as const}}>
                        <b>Коды домофона:</b><br/>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Toolbar;

function Title(props: any) {
    const style = {
        margin: '0px'
    }
    return (
        <table style={{height: '100%'}}>
            <tbody>
            <tr>
                <th colSpan={2}>
                    <h2 style={style}>{props.value}</h2>
                </th>
            </tr>
            </tbody>
        </table>);
}


function Image(props: any) {
    const style = {
        width: '100%'
    }
    return (<img style={style} src={props.value}/>)
}

function Text(props: any) {
    const style = {
        position: 'absolute' as 'absolute',
        top: '290px',
        left: '15px',
        right: '15px',
        bottom: '15px',
        overflow: 'auto' as 'auto',
        paddingRight: '5px',
        textAlign: 'justify' as const
    }
    return (<div style={style}
                 dangerouslySetInnerHTML={{__html: '&nbsp;&nbsp;&nbsp;&nbsp;' + props.value}}
    />)
}
