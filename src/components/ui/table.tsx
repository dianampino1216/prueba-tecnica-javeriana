import type { ReactNode } from 'react';

// El accessor puede ser una llave del objeto (ej: 'nombre') o una función para renderizar algo a medida (ej: un botón)
export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export const Table = <T,>({ 
  data, 
  columns, 
  emptyMessage = 'No hay registros disponibles' 
}: TableProps<T>) => {
  return (
    <div className="w-full overflow-x-auto bg-card rounded-xl shadow-sm border border-border">
      <table className="w-full text-left text-sm text-foreground">        
        <thead className="bg-muted border-b border-border">
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index} 
                  className="px-6 py-4 font-semibold text-foreground/70 uppercase tracking-wider text-xs"
                >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-6 py-12 text-center text-foreground font-medium"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="hover:bg-muted/50 transition-colors duration-150"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row[col.accessor] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        
      </table>
    </div>
  );
};