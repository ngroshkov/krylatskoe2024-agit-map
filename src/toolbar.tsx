import * as React from 'react';

export interface ToolbarProps {
    properties: any
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

    const codes = props.properties != null ?
        Object.entries(JSON.parse(props.properties.codes_json))
            .map((val, index) => {
                const key = val[1] != null ?
                    <span>{val[0] + ": " + val[1]}</span> :
                    <span>{val[0] + ": "}<b style={{color:"red"}}>Нет кода</b></span>
                return <span key={index}>{key}<br/></span>
            })
        : <span/>

    return <div style={style}>
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
                        <b>Жителей:</b> {props.properties != null ? <span>{props.properties['address:residents']}</span> : ""}<br/>
                        <b>Квартир:</b> {props.properties != null ? <span>{props.properties['address:apartments']}</span> : ""}<br/>
                        <b>Подъездов:</b> {props.properties != null ? <span>{props.properties['address:halls']}</span> : ""}<br/>
                    </td>
                    <td style={{padding: "5px", verticalAlign: "top" as const}}>
                        <b>Коды домофонов:</b><br/>
                        <span>{codes}</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>;
}

export default Toolbar;
