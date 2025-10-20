import Table from 'react-bootstrap/Table';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../appContext';

function StatsTab({ inventory }) {
    const { t } = useTranslation();
    const { darkMode } = useAppContext();


    if (!inventory) {
        return <p>{t('noStats')}</p>;
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
            <h4>{t('invStats')}</h4>
            <Table striped bordered hover responsive className={darkMode ? 'table-dark' : 'table-light'}>
                <tbody>
                    {totalItems !== null && (
                        <tr>
                            <td>{t('totalItems')}</td>
                            <td>{totalItems}</td>
                        </tr>
                    )}
                    {uniqueContributorsCount !== null && (
                        <tr>
                            <td>{t('totalContributors')}</td>
                            <td>{uniqueContributorsCount}</td>
                        </tr>
                    )}
                    {biggestContributor !== null && (
                        <tr>
                            <td>{t('biggestContributor')}</td>
                            <td>
                                <a href='personal' style={{ textDecoration: "none" }}>
                                    {biggestContributor}
                                </a>
                            </td>
                        </tr>
                    )}
                    {totalItems === null && uniqueContributorsCount === null && biggestContributor === null && (
                        <tr>
                            <td colSpan="2">{t('noStats')}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}

export default StatsTab;
