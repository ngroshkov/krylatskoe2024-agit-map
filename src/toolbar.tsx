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
        height: '110px',
        backgroundColor: 'white',
        borderRadius: '10px',
        opacity: 0.9,
        textAlign: 'center' as const,
        padding: '15px'
    };

    const address = props?.properties?.['address'] || "";
    const uik = props?.properties?.['uik'] ||  "";
    const flats = props?.properties?.['building:flats'] || "";
    const halls = props?.properties?.['building:halls'] || "";

    // const contacts = props.properties != null ?
    //     JSON.parse(props.properties.contacts != 'null' ? props.properties.contacts : '[]')
    //         .map((val: any, index: any) => {
    //             let fio = val['fio']
    //             let apartment = val['apartment']
    //             return <span key={index}>{fio} - {apartment}<br/></span>
    //         }) : <span/>

    return <div style={style}>
            <table style={{width: '100%', height: '100%', display: 'flex', flexFlow: 'column'}}>
                <thead>
                    <tr>
                        <th colSpan={2}>
                            <h4 style={{margin: '0px'}}>
                                {address}
                            </h4>
                        </th>
                    </tr>
                </thead>
                <tbody style={{flex: '1 1 auto', display: 'block', overflowY: 'scroll'}}>
                    <tr style={{textAlign: "left" as const}}>
                        <td style={{padding: "5px", verticalAlign: "top" as const}}>
                            <b>УИК:</b> <span>№ {uik}</span> <br/>
                            {/*<b>Жителей:</b> {props.properties != null ? <span>{props.properties['address:residents']}</span> : ""}<br/>*/}
                            <b>Квартир:</b> <span>{flats}</span> <br/>
                            <b>Подъездов:</b> <span>{halls}</span><br/>
                        </td>
                        <td style={{padding: "5px", verticalAlign: "top" as const}}>
                            {/*<b>Контакты:</b><br/>*/}
                            {/*<span>{contacts}</span>*/}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>;
}

export default Toolbar;
