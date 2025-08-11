// /hooks/useServicesLoader.js - VERSIÓN FINAL ROBUSTA

import { useState, useEffect, useCallback, useRef } from 'react';
import ServiceManager from '@/constants/services/ServiceManager';

export const useServicesLoader = (targetPackageType, setPackageType) => {
  // Estados principales
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Refs para control
  const mountedRef = useRef(true);
  const packageTypeRef = useRef(targetPackageType);
  const loadingTimeoutRef = useRef(null);
  const emergencyTimeoutRef = useRef(null);
  const isLoadingRef = useRef(false); // Prevent double loading

  // Identificador único para esta instancia del hook
  const instanceId = useRef(
    `${targetPackageType}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`
  );

  // Debug logger
  const logDebug = useCallback((message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔧 [${instanceId.current}] ${message}`, data);
    }
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    mountedRef.current = true;
    packageTypeRef.current = targetPackageType;

    logDebug('Hook initialized', { targetPackageType });

    return () => {
      mountedRef.current = false;
      isLoadingRef.current = false;

      // Limpiar todos los timeouts
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      if (emergencyTimeoutRef.current) {
        clearTimeout(emergencyTimeoutRef.current);
        emergencyTimeoutRef.current = null;
      }

      logDebug('Hook cleanup completed');
    };
  }, [targetPackageType, logDebug]);

  // Función principal de carga
  const loadServices = useCallback(
    async (packageType) => {
      // Validaciones iniciales
      if (!mountedRef.current) {
        logDebug('Load cancelled - component unmounted');
        return;
      }

      if (!packageType) {
        logDebug('Load cancelled - no package type');
        return;
      }

      if (packageType !== packageTypeRef.current) {
        logDebug('Load cancelled - package type mismatch', {
          expected: packageTypeRef.current,
          received: packageType,
        });
        return;
      }

      if (isLoadingRef.current) {
        logDebug('Load cancelled - already loading');
        return;
      }

      try {
        isLoadingRef.current = true;
        logDebug('Starting load process', { packageType });

        // Limpiar timeouts anteriores
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        if (emergencyTimeoutRef.current) {
          clearTimeout(emergencyTimeoutRef.current);
          emergencyTimeoutRef.current = null;
        }

        // Establecer estados de carga
        if (mountedRef.current) {
          setIsLoading(true);
          setIsReady(false);
          setError(null);
          logDebug('Loading states set');
        }

        // Configurar package type si es necesario
        if (setPackageType && typeof setPackageType === 'function') {
          setPackageType(packageType);
          logDebug('Package type set via context');
        }

        // Delay mínimo para evitar flickers y permitir cleanup
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Verificar si aún estamos montados después del delay
        if (!mountedRef.current || packageTypeRef.current !== packageType) {
          logDebug('Load cancelled after delay - component state changed');
          isLoadingRef.current = false;
          return;
        }

        // Cargar servicios con manejo de errores robusto
        let loadedServices = [];
        try {
          loadedServices = ServiceManager.getByPackageType(packageType) || [];
          logDebug('ServiceManager call successful', {
            packageType,
            servicesCount: loadedServices.length,
          });
        } catch (serviceError) {
          logDebug('ServiceManager call failed', {
            packageType,
            error: serviceError.message,
          });

          // Fallback con servicios dummy para testing
          if (packageType === 'premium') {
            loadedServices = [
              {
                id: `premium-dummy-1-${Date.now()}`,
                name: 'Luxe Arrival - SUV Service',
                description: 'Premium airport transfer',
                packageType: ['premium'],
                category: 'transportation',
              },
              {
                id: `premium-dummy-2-${Date.now()}`,
                name: 'Private Yacht Experience',
                description: 'Exclusive yacht charter',
                packageType: ['premium'],
                category: 'water-activities',
              },
            ];
          } else {
            loadedServices = [
              {
                id: `standard-dummy-1-${Date.now()}`,
                name: 'Airport Transfer',
                description: 'Standard airport transfer',
                packageType: ['standard'],
                category: 'transportation',
              },
              {
                id: `standard-dummy-2-${Date.now()}`,
                name: 'Catamaran Trip',
                description: 'Group catamaran experience',
                packageType: ['standard'],
                category: 'water-activities',
              },
            ];
          }
          logDebug('Using fallback services', { count: loadedServices.length });
        }

        // Verificar nuevamente si estamos montados
        if (!mountedRef.current || packageTypeRef.current !== packageType) {
          logDebug(
            'Load cancelled before setting services - component state changed'
          );
          isLoadingRef.current = false;
          return;
        }

        // Establecer servicios
        setServices(loadedServices);
        logDebug('Services set in state', { count: loadedServices.length });

        // Timeout para marcar como listo
        loadingTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current && packageTypeRef.current === packageType) {
            setIsReady(true);
            setIsLoading(false);
            isLoadingRef.current = false;
            logDebug('Services marked as ready');
          }
        }, 150);
      } catch (err) {
        logDebug('Load process failed', { error: err.message });

        if (mountedRef.current && packageTypeRef.current === packageType) {
          setError(err);
          setIsLoading(false);
          setIsReady(true); // Mostrar aunque haya error
          isLoadingRef.current = false;
        }
      }
    },
    [setPackageType, logDebug]
  );

  // Efecto para carga inicial y cambios de package type
  useEffect(() => {
    if (!targetPackageType) {
      logDebug('No target package type provided');
      return;
    }

    // Actualizar la referencia
    packageTypeRef.current = targetPackageType;

    // Cargar servicios
    loadServices(targetPackageType);
  }, [targetPackageType, loadServices]);

  // Función para forzar visibilidad (emergency)
  const forceVisible = useCallback(() => {
    logDebug('Force visible called');

    if (mountedRef.current) {
      // Limpiar timeouts
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      if (emergencyTimeoutRef.current) {
        clearTimeout(emergencyTimeoutRef.current);
        emergencyTimeoutRef.current = null;
      }

      setIsReady(true);
      setIsLoading(false);
      isLoadingRef.current = false;
      logDebug('Force visible completed');
    }
  }, [logDebug]);

  // Emergency timeout - último recurso
  useEffect(() => {
    emergencyTimeoutRef.current = setTimeout(() => {
      if (
        mountedRef.current &&
        !isReady &&
        packageTypeRef.current === targetPackageType
      ) {
        logDebug('Emergency timeout triggered - forcing visible');
        forceVisible();
      }
    }, 3000);

    // Cleanup del timeout
    return () => {
      if (emergencyTimeoutRef.current) {
        clearTimeout(emergencyTimeoutRef.current);
        emergencyTimeoutRef.current = null;
      }
    };
  }, [isReady, targetPackageType, forceVisible, logDebug]);

  // Función de recarga
  const reload = useCallback(() => {
    logDebug('Reload requested');

    // Reset estado
    if (mountedRef.current) {
      setServices([]);
      setIsReady(false);
      setError(null);
      isLoadingRef.current = false;
    }

    // Delay pequeño para permitir reset
    setTimeout(() => {
      if (mountedRef.current) {
        loadServices(packageTypeRef.current);
      }
    }, 100);
  }, [loadServices, logDebug]);

  // Estado de retorno
  const hookState = {
    services,
    isLoading,
    isReady,
    error,
    forceVisible,
    reload,
    // Debug info solo en desarrollo
    ...(process.env.NODE_ENV === 'development' && {
      _debug: {
        instanceId: instanceId.current,
        mounted: mountedRef.current,
        currentPackageType: packageTypeRef.current,
        targetPackageType,
        isLoadingRef: isLoadingRef.current,
      },
    }),
  };

  // Log final del estado
  if (process.env.NODE_ENV === 'development') {
    // Solo log cuando hay cambios importantes
    const shouldLog =
      services.length > 0 ||
      error ||
      (!isLoading && !isReady) ||
      (services.length === 0 && !isLoading && isReady);

    if (shouldLog) {
      logDebug('Hook state', {
        servicesCount: services.length,
        isLoading,
        isReady,
        hasError: !!error,
      });
    }
  }

  return hookState;
};
