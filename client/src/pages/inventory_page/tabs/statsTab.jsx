import React from 'react';
import Table from 'react-bootstrap/Table';

function StatsTab({ itemsData }) {
    if (!itemsData || itemsData.length === 0) {
        return <p>No items available for statistics.</p>;
    }

    const quantities = itemsData.map(item => item.quantity);
    const totalItems = itemsData.length;
    const avgQuantity = (quantities.reduce((a, b) => a + b, 0) / totalItems).toFixed(2);
    const minQuantity = Math.min(...quantities);
    const maxQuantity = Math.max(...quantities);

    const freq = arr => {
        const count = {};
        arr.forEach(val => count[val] = (count[val] || 0) + 1);
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
        return most.join(', ');
    };

    const mostCommonName = freq(itemsData.map(i => i.name));
    const biggestContributor = freq(itemsData.map(i => i.creator));
    const uniqueContributorsCount = new Set(itemsData.map(item => item.creator)).size;

    return (
        <div>
            <h4>Inventory Statistics</h4>
            <Table striped bordered hover responsive>
                <tbody>
                    <tr>
                        <td>Total Items</td>
                        <td>{totalItems}</td>
                    </tr>
                    <tr>
                        <td>Quantity (Average)</td>
                        <td>{avgQuantity}</td>
                    </tr>
                    <tr>
                        <td>Quantity (Min)</td>
                        <td>{minQuantity}</td>
                    </tr>
                    <tr>
                        <td>Quantity (Max)</td>
                        <td>{maxQuantity}</td>
                    </tr>
                    <tr>
                        <td>Most Frequent Name</td>
                        <td>{mostCommonName}</td>
                    </tr>
                    <tr>
                        <td>Total Contributors</td>
                        <td>{uniqueContributorsCount}</td>
                    </tr>
                    <tr>
                        <td>Biggest Contributor</td>
                        <td><a href='personal' style={{textDecoration: "none"}}>{biggestContributor}</a></td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}

export default StatsTab;
