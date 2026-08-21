import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Table({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto rounded-md border border-slate-800">
      <table
        className={twMerge(clsx('w-full caption-bottom text-xs text-left', className))}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={twMerge(clsx('bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]', className))}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={twMerge(clsx('divide-y divide-slate-800/60 bg-slate-950/40', className))}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={twMerge(
        clsx('transition-colors hover:bg-slate-800/40 data-[state=selected]:bg-slate-800', className)
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={twMerge(
        clsx('h-9 px-3.5 text-left align-middle font-medium text-slate-400 [&:has([role=checkbox])]:pr-0', className)
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={twMerge(
        clsx('p-3 align-middle [&:has([role=checkbox])]:pr-0 text-slate-200', className)
      )}
      {...props}
    >
      {children}
    </td>
  );
}
