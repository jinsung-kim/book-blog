import React from 'react';
import './styles/Container.css';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Container({ children }: LayoutProps) {
  return <div className="container">{children}</div>;
}
