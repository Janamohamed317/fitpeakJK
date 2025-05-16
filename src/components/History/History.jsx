import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faChartLine, faFire, faClock, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './history.module.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { getUserWorkoutHistory, exportWorkoutHistoryToCSV } from '../../services/historyService';

const History = () => {
	const [workouts, setWorkouts] = useState([]);
	const [filteredWorkouts, setFilteredWorkouts] = useState([]);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [workoutType, setWorkoutType] = useState('');
	const [chartInstance, setChartInstance] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeChart, setActiveChart] = useState('duration'); // 'duration' or 'calories'
	
	// Estadísticas
	const [stats, setStats] = useState({
		totalWorkouts: 0,
		totalDuration: 0,
		totalCalories: 0,
		averageCaloriesPerWorkout: 0,
		averageCaloriesPerMinute: 0,
		mostFrequentType: '',
	});
	
	// Cargar datos de la API
	useEffect(() => {
		const fetchWorkouts = async () => {
			try {
				setIsLoading(true);
				const data = await getUserWorkoutHistory();
				
				// Formatear los datos para que coincidan con la estructura esperada
				const formattedWorkouts = data.map(workout => ({
					id: workout.workoutId || workout._id,
					date: new Date(workout.date).toISOString().split('T')[0],
					type: workout.category || 'Other',
					duration: workout.duration || 0,
					calories: parseFloat(workout.calories) || 0,
					completed: workout.completed || false
				}));
				
				setWorkouts(formattedWorkouts);
				calculateStats(formattedWorkouts);
				setError(null);
			} catch (err) {
				console.error('Error fetching workouts:', err);
				setError('Failed to load workout history. Please try again later.');
				// Usar datos de ejemplo si hay un error
				const sampleData = [
					{ date: '2025-02-10', type: 'Cardio', duration: 30, calories: 250, completed: true },
					{ date: '2025-01-12', type: 'Strength', duration: 45, calories: 300, completed: true },
					{ date: '2025-02-14', type: 'Cardio', duration: 40, calories: 270, completed: true },
					{ date: '2025-02-16', type: 'Yoga', duration: 50, calories: 180, completed: true },
				];
				setWorkouts(sampleData);
				calculateStats(sampleData);
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchWorkouts();
	}, []);
	
	// Calcular estadísticas
	const calculateStats = (workoutData) => {
		if (!workoutData || workoutData.length === 0) {
			return;
		}
		
		// Solo considerar entrenamientos completados para las estadísticas
		const completedWorkouts = workoutData.filter(w => w.completed);
		const totalWorkouts = completedWorkouts.length;
		
		if (totalWorkouts === 0) {
			setStats({
				totalWorkouts: 0,
				totalDuration: 0,
				totalCalories: 0,
				averageCaloriesPerWorkout: 0,
				averageCaloriesPerMinute: 0,
				mostFrequentType: '-'
			});
			return;
		}
		
		const totalDuration = completedWorkouts.reduce((sum, w) => sum + w.duration, 0);
		const totalCalories = completedWorkouts.reduce((sum, w) => sum + w.calories, 0);
		
		// Encontrar el tipo más frecuente
		const typeCounts = {};
		completedWorkouts.forEach(w => {
			typeCounts[w.type] = (typeCounts[w.type] || 0) + 1;
		});
		
		let mostFrequentType = '-';
		let maxCount = 0;
		
		Object.entries(typeCounts).forEach(([type, count]) => {
			if (count > maxCount) {
				maxCount = count;
				mostFrequentType = type;
			}
		});
		
		setStats({
			totalWorkouts,
			totalDuration,
			totalCalories,
			averageCaloriesPerWorkout: totalCalories / totalWorkouts,
			averageCaloriesPerMinute: totalDuration > 0 ? totalCalories / totalDuration : 0,
			mostFrequentType
		});
	};

	useEffect(() => {
		setFilteredWorkouts(workouts);
	}, [workouts]);

	useEffect(() => {
		if (filteredWorkouts.length > 0) {
			updateChart(filteredWorkouts, activeChart);
		}
		return () => {
			if (chartInstance) {
				chartInstance.destroy();
			}
		};
	}, [filteredWorkouts, activeChart]);

	const filterWorkouts = () => {
		const filteredData = workouts.filter((workout) => {
			const workoutDate = new Date(workout.date);
			const start = startDate ? new Date(startDate) : null;
			const end = endDate ? new Date(endDate) : null;

			return (
				(!start || workoutDate >= start) &&
				(!end || workoutDate <= end) &&
				(!workoutType || workout.type === workoutType)
				// Mostrar todos los entrenamientos, completados o no
			);
		});

		// Ordenar por fecha (más reciente primero)
		filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
		setFilteredWorkouts(filteredData);
		
		// Recalcular estadísticas basadas en los datos filtrados
		// Pero solo usando los entrenamientos completados para las estadísticas
		const completedFilteredData = filteredData.filter(workout => workout.completed);
		calculateStats(completedFilteredData);
	};

	const updateChart = (workoutData, chartType = 'duration') => {
		if (!workoutData || workoutData.length === 0 || !document.getElementById('workoutChart')) {
			return;
		}
		
		const ctx = document.getElementById('workoutChart').getContext('2d');

		if (chartInstance) {
			chartInstance.destroy();
		}

		// Ordenar datos por fecha (más antiguo primero para el gráfico)
		const sortedData = [...workoutData].sort((a, b) => new Date(a.date) - new Date(b.date));
		
		// Configurar colores según el tipo de gráfico
		let primaryColor, gradientColor;
		let dataLabel, dataValues;
		
		if (chartType === 'calories') {
			primaryColor = '#FF5722'; // Naranja para calorías
			gradientColor = 'rgba(255, 87, 34, 0.6)';
			dataLabel = 'Calories Burned';
			dataValues = sortedData.map((w) => w.calories);
		} else {
			primaryColor = '#4CAF50'; // Verde para duración
			gradientColor = 'rgba(76, 175, 80, 0.6)';
			dataLabel = 'Workout Duration (minutes)';
			dataValues = sortedData.map((w) => w.duration);
		}

		const gradient = ctx.createLinearGradient(0, 0, 0, 400);
		gradient.addColorStop(0, gradientColor);
		gradient.addColorStop(1, gradientColor.replace('0.6', '0.1'));

		const labels = sortedData.map((w) => w.date);

		const newChartInstance = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: dataLabel,
						data: dataValues,
						backgroundColor: gradient,
						borderColor: primaryColor,
						borderWidth: 3,
						pointBackgroundColor: '#fff',
						pointBorderColor: primaryColor,
						pointRadius: 6,
						pointHoverRadius: 8,
						fill: true,
						tension: 0.4,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						labels: { color: '#ffffff' },
					},
					tooltip: {
						backgroundColor: 'rgba(0,0,0,0.8)',
						bodyColor: '#ffffff',
						titleColor: primaryColor,
					},
				},
				scales: {
					x: {
						grid: { color: '#333333' },
						ticks: { color: '#ffffff' },
					},
					y: {
						grid: { color: '#333333' },
						ticks: { color: '#ffffff' },
					},
				},
			},
		});

		setChartInstance(newChartInstance);
	};

	// Función para exportar datos a CSV
	const handleExportCSV = () => {
		const csvUrl = exportWorkoutHistoryToCSV(filteredWorkouts);
		if (csvUrl) {
			// Crear un enlace temporal y hacer clic en él para descargar
			const link = document.createElement('a');
			link.href = csvUrl;
			link.setAttribute('download', `workout-history-${new Date().toISOString().split('T')[0]}.csv`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};
	
	// Cambiar el tipo de gráfico
	const toggleChartType = () => {
		setActiveChart(activeChart === 'duration' ? 'calories' : 'duration');
	};
	
	return (
		<>
			<Navbar />
			<div className={styles.container}>
				<div className={styles.header}>
					<h2>Workout History</h2>
					<button 
						className={styles.exportButton}
						onClick={handleExportCSV}
						disabled={filteredWorkouts.length === 0}
					>
						<FontAwesomeIcon icon={faDownload} /> Export to CSV
					</button>
				</div>
				
				{isLoading ? (
					<div className={styles.loading}>Loading workout history...</div>
				) : error ? (
					<div className={styles.error}>{error}</div>
				) : (
					<>
						{/* Estadísticas */}
						<div className={styles.statsGrid}>
							<div className={styles.statCard}>
								<h3>Total Workouts</h3>
								<p>{stats.totalWorkouts}</p>
							</div>
							<div className={styles.statCard}>
								<h3>Total Duration</h3>
								<p>{stats.totalDuration} minutes</p>
							</div>
							<div className={styles.statCard}>
								<h3>Total Calories</h3>
								<p>{stats.totalCalories.toFixed(0)} kcal</p>
							</div>
							<div className={styles.statCard}>
								<h3>Avg. Calories/Workout</h3>
								<p>{stats.averageCaloriesPerWorkout.toFixed(1)} kcal</p>
							</div>
						</div>

						{/* Filtros */}
						<div className={styles.filters}>
							<label>
								<FontAwesomeIcon icon={faCalendarAlt} /> Start Date:
								<input
									type="date"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
								/>
							</label>
							<label>
								<FontAwesomeIcon icon={faCalendarAlt} /> End Date:
								<input
									type="date"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
								/>
							</label>
							<label>
								Workout Type:
								<select
									value={workoutType}
									onChange={(e) => setWorkoutType(e.target.value)}
								>
									<option value="">All Types</option>
									<option value="Cardio">Cardio</option>
									<option value="Strength">Strength</option>
									<option value="Yoga">Yoga</option>
									<option value="Other">Other</option>
								</select>
							</label>
							<button 
								className={styles.filterButton}
								onClick={filterWorkouts}
							>
								Apply Filters
							</button>
						</div>

						{filteredWorkouts.length === 0 ? (
							<div className={styles.noData}>No workouts found for the selected filters.</div>
						) : (
							<>
								{/* Tabla de entrenamientos */}
								<div className={styles.tableWrapper}>
									<table className={styles.workoutTable}>
										<thead>
											<tr>
												<th>Date</th>
												<th>Workout Type</th>
												<th>Duration</th>
												<th>Calories Burned</th>
											</tr>
										</thead>
										<tbody>
											{filteredWorkouts.map((workout, index) => (
												<tr key={index}>
													<td>{workout.date}</td>
													<td>
														<span className={`${styles.workoutType} ${styles[workout.type.toLowerCase()]}`}>
															{workout.type}
														</span>
													</td>
													<td>{workout.duration} min</td>
													<td>{workout.calories} kcal</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* Controles del gráfico */}
								<div className={styles.chartControls}>
									<h3>Workout Progress</h3>
									<div className={styles.chartToggle}>
										<button 
											className={`${styles.toggleButton} ${activeChart === 'duration' ? styles.active : ''}`}
											onClick={() => setActiveChart('duration')}
										>
											<FontAwesomeIcon icon={faClock} /> Duration
										</button>
										<button 
											className={`${styles.toggleButton} ${activeChart === 'calories' ? styles.active : ''}`}
											onClick={() => setActiveChart('calories')}
										>
											<FontAwesomeIcon icon={faFire} /> Calories
										</button>
									</div>
								</div>

								{/* Gráfico */}
								<div className={styles.chartContainer}>
									<canvas id="workoutChart"></canvas>
								</div>
							</>
						)}
					</>
				)}
			</div>
			<Footer />
		</>
	);
};

export default History;
