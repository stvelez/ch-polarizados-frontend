import './Dashboard.scss';

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
        <p className="dashboard__subtitle">
          Resumen general de tu negocio
        </p>
      </div>

      <div className="dashboard__stats">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Ventas Totales</p>
            <h3 className="stat-card__value">$2,450,000</h3>
            <p className="stat-card__change stat-card__change--up">
              +12.5% vs mes anterior
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7h-9" />
              <path d="M14 17H5" />
              <circle cx="17" cy="17" r="3" />
              <circle cx="7" cy="7" r="3" />
            </svg>
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Productos</p>
            <h3 className="stat-card__value">54</h3>
            <p className="stat-card__change stat-card__change--up">
              +3 nuevos este mes
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--purple">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Clientes</p>
            <h3 className="stat-card__value">128</h3>
            <p className="stat-card__change stat-card__change--up">
              +8 nuevos este mes
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--orange">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Inventario</p>
            <h3 className="stat-card__value">342</h3>
            <p className="stat-card__change stat-card__change--down">
              -15 vs semana anterior
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard__content">
        <div className="content-card">
          <h2 className="content-card__title">Próximamente</h2>
          <p className="content-card__text">
            Aquí se mostrarán gráficas, reportes y análisis detallados de tu negocio.
          </p>
        </div>
      </div>
    </div>
  );
};
