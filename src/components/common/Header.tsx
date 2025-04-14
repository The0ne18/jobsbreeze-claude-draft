import styles from '@/styles/Header.module.css';

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}

export default function Header({ title, children }: HeaderProps) {
  return (
    <header className={styles.header}>
      {title && <h1 className={styles.title}>{title}</h1>}
      {children && <div className={styles.actions}>{children}</div>}
    </header>
  );
} 