import { useEffect, useState } from "react";
import styles from "./stats.module.css";
import axios from "axios";

const Stats = () => {
  const [statsData, setStatsData] = useState<any>(null);

  const JWT_TOKEN = localStorage.getItem("access_token");
  useEffect(() => {
    const fetchStats = async () => {
      const response: any = await axios.get(
        "http://localhost:3000/users/stats",
        {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
        },
      );
      setStatsData(response.data);
    };
    fetchStats();
  }, [JWT_TOKEN]);

  return (
    <div className={styles.statsContent}>
      <div className={styles.even}>{`email: ${statsData?.email}`}</div>
      <div
        className={styles.odd}
      >{`sent messages: ${statsData?.howManyMessages}`}</div>
      <div className={styles.even}>{`id: ${statsData?.id}`}</div>
      <div
        className={styles.odd}
      >{`register at: ${statsData?.registerAt} `}</div>
    </div>
  );
};

export default Stats;
