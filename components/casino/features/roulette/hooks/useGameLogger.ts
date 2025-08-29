
import { useState, useCallback } from 'react';
import { LogEntry, LogType } from '../types';

export const useGameLogger = () => {
  const [log, setLog] = useState<LogEntry[]>([]);
  
  const addLogEntry = useCallback((type: LogType, message: string, data?: any) => {
    const newEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      data,
    };
    // Add to the top for reverse chronological order
    setLog(prevLog => [newEntry, ...prevLog]);
  }, []);

  const clearLog = useCallback(() => {
    setLog([]);
    addLogEntry('info', 'Log cleared.');
  }, [addLogEntry]);

  return { log, addLogEntry, clearLog };
};
