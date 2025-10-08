'use client';
import { useEffect } from 'react';
import mqtt from 'mqtt';

const deviceId = 1;

const MqttSubscriber = () => {
  useEffect(() => {

    const broker = process.env.NEXT_PUBLIC_MQTT_BROKER_URL || '';
    const options = {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME || '',
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD || '',
    };
    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const client = mqtt.connect(broker, options);

    client.on('connect', () => {
      client.subscribe('esp32/alert', (err) => {
      });
    });
    client.on('message', async (topic, message) => {
      try {
        const mqttData = JSON.parse(message.toString());
        const trapFillLevel = Number(mqttData.distance);
        if (isNaN(trapFillLevel)) {
          return;
        }
        const postData = {
          device: deviceId,
          trap_fill_level: trapFillLevel,
          topic: 'esp32/alert',
        };

        const res = await fetch(`${backendUrl}/api/data_monitoring/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(JSON.stringify(err));} }
      catch {}
    });

    client.on('error', () => {
      client.end(); });
    return () => {
      client.end();};}, []);

  return null;
};

export default MqttSubscriber;
