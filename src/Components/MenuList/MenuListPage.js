import React, { useEffect, useState } from "react";
import './splitpanel.css';

function MenuListPage({ menuData }) {
    const [interfaces, setInterfaces] = useState([]);
    const [isTable, setIsTable] = useState(false);

    useEffect(() => {
        const getMenuItemDetails = async () => {
            try {
                const response = await fetch(`/getModule/${menuData}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.data.interfaces && data.data.interfaces.interface) {
                        setInterfaces(data.data.interfaces.interface);
                        setIsTable(true);
                    } else if (data.data['terminal-device']['logical-channels']['channels'] ) {
                        setInterfaces(data.data['terminal-device']['logical-channels']['channels']);
                        setIsTable(true);
                    }
                    
                    else {
                        setInterfaces(data.data)
                        setIsTable(false);
                    }
                } else {
                    console.error("Request failed with status:", response.status);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        getMenuItemDetails();
    }, [menuData]);

    console.log("menuData", menuData);

    return (
        <div>
            {isTable ? (
                <table className="dynamic-table">
                    <thead>
                        <tr>
                            {interfaces.length > 0 && Object.keys(interfaces[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {interfaces.map((interfaceData, index) => (
                            <tr key={index}>
                                {Object.values(interfaceData).map((value, index) => (
                                    <td key={index}>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : ( 
                <ul>
                    {interfaces.map((interfaceData, index) => (
                        <li key={index}>
                            {Object.entries(interfaceData).map(([key, value]) => (
                                <div key={key}>
                                    <strong>{key}:</strong> {JSON.stringify(value)}
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>

            )}
        </div>
    );
}

export default MenuListPage;
