// /components/shared/ServicesContainer.jsx - VERSIÓN FINAL UNIVERSAL

import React, { useState, useEffect, useRef } from 'react';

const ServicesContainer = ({
  children,
  isReady = false,
  isLoading = false,
  services = [],
  packageType = 'standard',
  fallbackComponent = null,
  className = '',
  minHeight = '200px',
  style = {},
}) => {
  // Estados internos
  const [forceShow, setForceShow] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [emergencyShow, setEmergencyShow] = useState(false);

  // Refs para control
  const containerRef = useRef(null);
  const emergencyTimeoutRef = useRef(null);
  const forceTimeoutRef = useRef(null);
  const finalTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  // Identificador único
  const instanceId = useRef(
    `container-${packageType}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)}`
  );

  // Debug logger
  const logDebug = (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎨 [${instanceId.current}] ${message}`, data);
    }
  };

  // Cleanup al desmontar
  useEffect(() => {
    mountedRef.current = true;
    logDebug('Container initialized', {
      packageType,
      isReady,
      isLoading,
      servicesCount: services.length,
    });

    return () => {
      mountedRef.current = false;

      // Limpiar todos los timeouts
      [emergencyTimeoutRef, forceTimeoutRef, finalTimeoutRef].forEach((ref) => {
        if (ref.current) {
          clearTimeout(ref.current);
          ref.current = null;
        }
      });

      logDebug('Container cleanup completed');
    };
  }, [packageType, logDebug]);

  // Lógica principal de visibilidad - MÁS ROBUSTA
  const shouldShow =
    isReady || // Hook dice que está listo
    forceShow || // Forzado manualmente
    emergencyShow || // Emergency timeout
    (!isLoading && services.length > 0) || // Tiene servicios y no está cargando
    hasShown; // Ya se mostró antes

  // Emergency timeout - Nivel 1: Si no se muestra después de 1.5 segundos
  useEffect(() => {
    if (emergencyTimeoutRef.current) {
      clearTimeout(emergencyTimeoutRef.current);
    }

    if (!shouldShow && !isLoading && mountedRef.current) {
      emergencyTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current && !shouldShow) {
          logDebug('Emergency timeout Level 1 - forcing show');
          setForceShow(true);
        }
      }, 1500);
    }

    return () => {
      if (emergencyTimeoutRef.current) {
        clearTimeout(emergencyTimeoutRef.current);
        emergencyTimeoutRef.current = null;
      }
    };
  }, [shouldShow, isLoading, logDebug]);

  // Force timeout - Nivel 2: Si hay servicios pero no se muestran
  useEffect(() => {
    if (forceTimeoutRef.current) {
      clearTimeout(forceTimeoutRef.current);
    }

    if (
      services.length > 0 &&
      !shouldShow &&
      !isLoading &&
      mountedRef.current
    ) {
      forceTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current && services.length > 0 && !shouldShow) {
          logDebug(
            'Emergency timeout Level 2 - services exist but not showing'
          );
          setEmergencyShow(true);
        }
      }, 1000);
    }

    return () => {
      if (forceTimeoutRef.current) {
        clearTimeout(forceTimeoutRef.current);
        forceTimeoutRef.current = null;
      }
    };
  }, [services.length, shouldShow, isLoading, logDebug]);

  // Final timeout - Nivel 3: Último recurso después de 3 segundos
  useEffect(() => {
    if (finalTimeoutRef.current) {
      clearTimeout(finalTimeoutRef.current);
    }

    finalTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current && !shouldShow) {
        logDebug('Emergency timeout Level 3 - final fallback');
        setEmergencyShow(true);
        setForceShow(true);
      }
    }, 3000);

    return () => {
      if (finalTimeoutRef.current) {
        clearTimeout(finalTimeoutRef.current);
        finalTimeoutRef.current = null;
      }
    };
  }, [shouldShow, logDebug]);

  // Marcar como mostrado cuando se muestra por primera vez
  useEffect(() => {
    if (shouldShow && !hasShown && mountedRef.current) {
      setHasShown(true);
      logDebug('Container first show', {
        isReady,
        forceShow,
        emergencyShow,
        servicesCount: services.length,
      });
    }
  }, [
    shouldShow,
    hasShown,
    isReady,
    forceShow,
    emergencyShow,
    services.length,
    logDebug,
  ]);

  // Fallback específico por tema
  const getDefaultFallback = () => {
    const baseClasses = 'text-center py-12 animate-pulse';

    if (packageType === 'premium') {
      return (
        <div className={baseClasses}>
          <div className='w-16 h-16 bg-amber-400/20 rounded-full mx-auto mb-4 animate-pulse'></div>
          <p className='text-amber-300 text-lg font-medium'>
            Preparing your premium services...
          </p>
          <p className='text-amber-400/60 text-sm mt-2'>
            Curating luxury experiences
          </p>
          <div className='mt-4 space-x-2'>
            <div className='inline-block w-2 h-2 bg-amber-400 rounded-full animate-bounce'></div>
            <div
              className='inline-block w-2 h-2 bg-amber-400 rounded-full animate-bounce'
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className='inline-block w-2 h-2 bg-amber-400 rounded-full animate-bounce'
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      );
    }

    return (
      <div className={baseClasses}>
        <div className='w-16 h-16 bg-blue-400/20 rounded-full mx-auto mb-4 animate-pulse'></div>
        <p className='text-gray-600 text-lg font-medium'>
          Preparing your services...
        </p>
        <p className='text-gray-400 text-sm mt-2'>
          Loading amazing experiences
        </p>
        <div className='mt-4 space-x-2'>
          <div className='inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce'></div>
          <div
            className='inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce'
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className='inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce'
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    );
  };

  // Manual force function
  const manualForceShow = () => {
    logDebug('Manual force show triggered');
    setForceShow(true);
    setEmergencyShow(true);
    setHasShown(true);
  };

  // Estilos combinados
  const containerClasses = [
    'services-container',
    packageType === 'premium' ? 'premium-services' : 'standard-services',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerStyles = {
    opacity: shouldShow ? 1 : 0,
    visibility: shouldShow ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease-in-out',
    minHeight,
    position: 'relative',
    ...style,
  };

  // Debug en desarrollo
  if (process.env.NODE_ENV === 'development') {
    const debugInfo = {
      packageType,
      shouldShow,
      isReady,
      isLoading,
      servicesCount: services.length,
      forceShow,
      emergencyShow,
      hasShown,
    };

    // Log solo cambios importantes para evitar spam
    if (shouldShow !== hasShown || forceShow || emergencyShow) {
      logDebug('Container visibility change', debugInfo);
    }
  }

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={containerStyles}
      data-services-ready={shouldShow}
      data-services-count={services.length}
      data-package-type={packageType}
      data-is-loading={isLoading}
      data-force-show={forceShow}
      data-emergency-show={emergencyShow}
      data-has-shown={hasShown}
      onClick={
        process.env.NODE_ENV === 'development' ? manualForceShow : undefined
      }
      title={
        process.env.NODE_ENV === 'development'
          ? 'Click to force show (dev only)'
          : undefined
      }
    >
      {shouldShow ? children : fallbackComponent || getDefaultFallback()}

      {/* Debug info visible en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '5px',
            borderRadius: '4px',
            fontSize: '10px',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          <div>🎨 {packageType}</div>
          <div>Services: {services.length}</div>
          <div>Ready: {isReady ? '✅' : '❌'}</div>
          <div>Show: {shouldShow ? '✅' : '❌'}</div>
          <div>Force: {forceShow ? '🔧' : '➖'}</div>
          <div>Emergency: {emergencyShow ? '🚨' : '➖'}</div>
        </div>
      )}
    </div>
  );
};

export default ServicesContainer;

// Hook opcional para debugging
export const useServicesContainerDebug = (packageType) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔧 ServicesContainer hook initialized for ${packageType}`);
    }
  }, [packageType]);

  return {
    packageType,
    timestamp: Date.now(),
  };
};
