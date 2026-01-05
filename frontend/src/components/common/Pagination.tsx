/**
 * Pagination-Komponente
 *
 * Zeigt Seitennavigation für pagierte Listen an.
 * Verwendet React-Bootstrap Pagination für einheitliches Styling.
 */
import { Pagination as BsPagination } from 'react-bootstrap';

interface PaginationProps {
  /** Aktuelle Seite (1-basiert) */
  currentPage: number;
  /** Gesamtanzahl der Seiten */
  totalPages: number;
  /** Callback wenn eine Seite ausgewählt wird */
  onPageChange: (page: number) => void;
  /** Optional: Maximale Anzahl der angezeigten Seitenzahlen */
  maxVisiblePages?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) => {
  // Keine Pagination anzeigen wenn nur eine Seite
  if (totalPages <= 1) {
    return null;
  }

  /**
   * Berechnet welche Seitenzahlen angezeigt werden sollen
   * Zeigt ... wenn es mehr Seiten gibt als angezeigt werden können
   */
  const getVisiblePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    // Berechne den Bereich der sichtbaren Seiten
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Anpassen wenn wir am Ende sind
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Erste Seite immer anzeigen
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Sichtbare Seitenzahlen
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Letzte Seite immer anzeigen
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <BsPagination className="justify-content-center">
      {/* Zurück-Button */}
      <BsPagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {/* Seitenzahlen */}
      {visiblePages.map((page, index) => {
        if (page === '...') {
          return <BsPagination.Ellipsis key={`ellipsis-${index}`} disabled />;
        }

        return (
          <BsPagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </BsPagination.Item>
        );
      })}

      {/* Vorwärts-Button */}
      <BsPagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </BsPagination>
  );
};
