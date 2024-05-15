import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { v4 as uuidv4 } from 'uuid';

function TouristAttractions() {

    const columns = [
        { field: 'title', headerName: '名稱', flex: 4, minWidth: 200 },
        { field: 'location', headerName: '地點', flex: 3, minWidth: 200 },
        { field: 'price', headerName: '票價', flex: 7, minWidth: 200 },
    ];

    const [originalData, setOriginalData] = useState([]);
    const [data, setData] = useState([{ id: uuidv4(), title: '', location: '', price: '' }]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6");
                const json = await response.json();
                const newData = json.map(item => ({
                    id: uuidv4(),
                    title: item.title,
                    location: item.showInfo[0]?.location || '未提供',
                    price: item.showInfo[0]?.price || '未提供'
                }));
                setOriginalData(newData);
                setData(newData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchText(value);
        const filteredData = originalData.filter((item) => item.title.includes(value));
        setData(filteredData);
    };

    return (
        <div style={{ width: '100%' }}>
            <h1>景點觀光展覽資訊</h1>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchText}
                    onChange={handleSearch}
                    size="small"
                />
            </Box>
            <DataGrid
                rows={data}
                columns={columns}
                loading={loading}
                pageSizeOptions={[10, 20, 50]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
            />
        </div>
    );
}

export default TouristAttractions;
