import React from 'react';
import Table from 'react-bootstrap/Table';

function StatsTab({ inventory }) {
    if (!inventory) {
        return <p>No items available for statistics.</p>;
    }

    const totalItems = inventory.items?.length ?? null;

    const creators = inventory.items
        ?.map(item => item.creator_email || '')
        .filter(Boolean) || [];

    const uniqueContributorsCount = creators.length > 0 ? new Set(creators).size : null;

    const freq = arr => {
        if (!arr || arr.length === 0) return null;
        const count = {};
        arr.forEach(val => val && (count[val] = (count[val] || 0) + 1));
        let maxCount = 0;
        let most = [];
        for (const key in count) {
            if (count[key] > maxCount) {
                maxCount = count[key];
                most = [key];
            } else if (count[key] === maxCount) {
                most.push(key);
            }
        }
        return most.length > 0 ? most.join(', ') : null;
    };

    const biggestContributor = freq(creators);

    return (
        <div>
            <h4>Inventory Statistics</h4>
            <Table striped bordered hover responsive>
                <tbody>
                    {totalItems !== null && (
                        <tr>
                            <td>Total Items</td>
                            <td>{totalItems}</td>
                        </tr>
                    )}
                    {uniqueContributorsCount !== null && (
                        <tr>
                            <td>Total Contributors</td>
                            <td>{uniqueContributorsCount}</td>
                        </tr>
                    )}
                    {biggestContributor !== null && (
                        <tr>
                            <td>Biggest Contributor</td>
                            <td>
                                <a href='personal' style={{ textDecoration: "none" }}>
                                    {biggestContributor}
                                </a>
                            </td>
                        </tr>
                    )}
                    {totalItems === null && uniqueContributorsCount === null && biggestContributor === null && (
                        <tr>
                            <td colSpan="2">No statistics available.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}

export default StatsTab;
