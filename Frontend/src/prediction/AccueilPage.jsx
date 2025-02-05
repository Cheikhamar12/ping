import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    Card,
    CardContent,
    Switch,
    FormControlLabel,
    Alert,
    Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Configuration de dayjs en français
dayjs.locale('fr');

// Enregistrement des composants Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Fonction utilitaire pour évaluer la performance des métriques
const evaluateMetric = (metric, value) => {
    const evaluations = {
        rmse: [
            { threshold: 1000, status: 'excellent', color: '#2E7D32' },
            { threshold: 3500, status: 'bon', color: '#1976D2' },
            { threshold: 5000, status: 'moyen', color: '#ED6C02' },
            { threshold: Infinity, status: 'à améliorer', color: '#D32F2F' }
        ],
        mae: [
            { threshold: 1000, status: 'excellent', color: '#2E7D32' },
            { threshold: 3500, status: 'bon', color: '#1976D2' },
            { threshold: 5000, status: 'moyen', color: '#ED6C02' },
            { threshold: Infinity, status: 'à améliorer', color: '#D32F2F' }
        ],
        mape: [
            { threshold: 10, status: 'excellent', color: '#2E7D32' },
            { threshold: 20, status: 'bon', color: '#1976D2' },
            { threshold: 30, status: 'moyen', color: '#ED6C02' },
            { threshold: Infinity, status: 'à améliorer', color: '#D32F2F' }
        ]
    };

    const evaluation = evaluations[metric].find(e => value <= e.threshold);
    return evaluation;
};

// Descriptions des métriques
const metricDescriptions = {
    rmse: "Erreur quadratique moyenne : mesure l'ampleur moyenne des erreurs de prédiction. Plus la valeur est basse, meilleure est la prédiction.",
    mae: "Erreur absolue moyenne : indique l'écart moyen entre les prédictions et les valeurs réelles. Une valeur plus basse signifie des prédictions plus précises.",
    mape: "Pourcentage d'erreur moyen absolu : représente l'erreur de prédiction en pourcentage. Un MAPE de 10% signifie que les prédictions sont en moyenne décalées de 10%."
};

const Prediction = () => {
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [useInterval, setUseInterval] = useState(false);
    const [metrics, setMetrics] = useState(null);
    const [lastAvailableDate, setLastAvailableDate] = useState(null);

    useEffect(() => {
        fetchMetrics();
        fetchLastAvailableDate();
    }, []);

    const fetchLastAvailableDate = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/last-available-date');
            const data = await response.json();
            if (data.status === 'success') {
                const lastDate = dayjs(data.last_date);
                setLastAvailableDate(lastDate);
                setStartDate(lastDate.add(1, 'day'));
                setEndDate(lastDate.add(15, 'day'));
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la dernière date:', error);
            setError('Erreur lors du chargement des dates disponibles');
        }
    };

    const fetchMetrics = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/metrics');
            const data = await response.json();
            if (data.status === 'success') {
                setMetrics(data.metrics);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des métriques:', error);
        }
    };

    // Calculer les dates min et max pour les sélecteurs
    const minDate = lastAvailableDate ? lastAvailableDate.add(1, 'day') : null;
    const maxDate = lastAvailableDate ? lastAvailableDate.add(30, 'day') : null;

    const handlePredict = async () => {
        setLoading(true);
        setError('');
        try {
            if (!startDate) {
                setError('Veuillez sélectionner une date de début');
                return;
            }

            const params = new URLSearchParams({
                start_date: startDate.format('YYYY-MM-DD'),
                ...(useInterval && endDate ? { end_date: endDate.format('YYYY-MM-DD') } : {})
            });

            const response = await fetch(`http://localhost:5001/api/predict?${params}`);
            const data = await response.json();

            if (data.status === 'success') {
                setPredictions(data.predictions);
            } else {
                setError(data.error || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error('Erreur complète:', error);
            setError('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    const MetricCard = ({ title, value, metric }) => {
        const evaluation = evaluateMetric(metric, value);
        
        return (
            <Card sx={{ flex: 1 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h4" sx={{ color: evaluation.color }}>
                            {metric === 'mape' ? `${value}%` : value}
                        </Typography>
                        <Chip 
                            label={evaluation.status}
                            sx={{ 
                                backgroundColor: evaluation.color,
                                color: 'white',
                                ml: 1
                            }}
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        {metricDescriptions[metric]}
                    </Typography>
                </CardContent>
            </Card>
        );
    };

    const chartData = predictions ? {
        labels: predictions.map(p => p.date),
        datasets: [
            {
                label: 'Prédiction',
                data: predictions.map(p => p.prediction),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.1
            },
            {
                label: 'Borne supérieure',
                data: predictions.map(p => p.upper_bound),
                borderColor: 'rgba(53, 162, 235, 0.2)',
                backgroundColor: 'rgba(53, 162, 235, 0.1)',
                fill: '+1',
                tension: 0.1
            },
            {
                label: 'Borne inférieure',
                data: predictions.map(p => p.lower_bound),
                borderColor: 'rgba(53, 162, 235, 0.2)',
                backgroundColor: 'rgba(53, 162, 235, 0.1)',
                fill: false,
                tension: 0.1
            }
        ]
    } : null;

    return (
        <Layout>
            <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#1976d2' }}>
                    Prédictions des commandes
                </Typography>

                {metrics && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                            Performance du modèle
                        </Typography>
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                            gap: 2 
                        }}>
                            <MetricCard 
                                title="RMSE" 
                                value={metrics.rmse} 
                                metric="rmse"
                            />
                            <MetricCard 
                                title="MAE" 
                                value={metrics.mae} 
                                metric="mae"
                            />
                            <MetricCard 
                                title="MAPE" 
                                value={metrics.mape} 
                                metric="mape"
                            />
                        </Box>
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Ces métriques sont calculées sur les données historiques pour évaluer la précision du modèle.
                            Plus les valeurs sont basses, plus le modèle est précis.
                        </Alert>
                    </Box>
                )}

                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr' >
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <DatePicker
                                        label="Date de début"
                                        value={startDate}
                                        onChange={setStartDate}
                                        minDate={minDate}
                                        maxDate={maxDate}
                                        disabled={!lastAvailableDate}
                                        sx={{ flex: 1 }}
                                        slotProps={{
                                            textField: {
                                                helperText: lastAvailableDate 
                                                    ? `Prédictions disponibles du ${minDate?.format('DD/MM/YYYY')} au ${maxDate?.format('DD/MM/YYYY')}`
                                                    : 'Chargement des dates...'
                                            }
                                        }}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={useInterval}
                                                onChange={(e) => setUseInterval(e.target.checked)}
                                            />
                                        }
                                        label="Utiliser un intervalle"
                                    />
                                    {useInterval && (
                                        <DatePicker
                                            label="Date de fin"
                                            value={endDate}
                                            onChange={setEndDate}
                                            minDate={startDate}
                                            maxDate={maxDate}
                                            disabled={!lastAvailableDate}
                                            sx={{ flex: 1 }}
                                        />
                                    )}
                                </Box>
                            </LocalizationProvider>

                            <Button
                                variant="contained"
                                onClick={handlePredict}
                                disabled={loading || !lastAvailableDate}
                                sx={{ 
                                    mt: 2,
                                    backgroundColor: '#1976d2',
                                    '&:hover': {
                                        backgroundColor: '#1565c0'
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Générer les prédictions'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {error && (
                    <Alert severity="error" sx={{ mb: 4 }}>
                        {error}
                    </Alert>
                )}

                {predictions && (
                    <>
                        <Card sx={{ mb: 4 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Graphique des prédictions
                                </Typography>
                                <Box sx={{ height: 400 }}>
                                    <Line
                                        data={chartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                                title: {
                                                    display: true,
                                                    text: 'Évolution des commandes prévues'
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Détails des prédictions
                                </Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell align="right">Prédiction</TableCell>
                                                <TableCell align="right">Borne inférieure</TableCell>
                                                <TableCell align="right">Borne supérieure</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {predictions.map((row) => (
                                                <TableRow key={row.date}>
                                                    <TableCell>{dayjs(row.date).format('DD/MM/YYYY')}</TableCell>
                                                    <TableCell align="right">{Math.round(row.prediction)}</TableCell>
                                                    <TableCell align="right">{Math.round(row.lower_bound)}</TableCell>
                                                    <TableCell align="right">{Math.round(row.upper_bound)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </>
                )}
            </Box>
        </Layout>
    );
};

export default Prediction;