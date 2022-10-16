import type { AppProps } from 'next/app'
import '../styles/globals.css'
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";
import '@fullcalendar/resource-timeline/main.css';
import '@fullcalendar/timeline/main.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
