import React from 'react';

export const AlertIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MagicIcon = ({ className }: { className?: string }) => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M3.125 5.20833L5.20833 3.125L21.875 19.7917L19.7917 21.875L3.125 5.20833ZM13.5417 5.20833L14.5833 3.125L15.625 5.20833L17.7083 6.25L15.625 7.29167L14.5833 9.375L13.5417 7.29167L11.4583 6.25L13.5417 5.20833ZM5.20833 15.625L6.25 13.5417L7.29167 15.625L9.375 16.6667L7.29167 17.7083L6.25 19.7917L5.20833 17.7083L3.125 16.6667L5.20833 15.625ZM4.16667 9.375L5.20833 10.4167L4.16667 11.4583L3.125 10.4167L4.16667 9.375ZM18.75 10.4167L19.7917 11.4583L18.75 12.5L17.7083 11.4583L18.75 10.4167Z" fill="currentColor" />
  </svg>
);