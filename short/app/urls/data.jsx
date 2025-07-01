"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";

function stripProtocol(url) {
    return url.replace(/(^\w+:|^)\/\//, "");
}

function truncateString(str, maxLength = 20) {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + "...";
}

export default function Data({ data }) {
    const columns = [{
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                    className="translate-y-0"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-0"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    }, {
        id: "url",
        accessorKey: "url",
        header: "URL",
        cell: ({ row }) => (
            // Strip http:// or https:// from the URL
            <Link
                href={row.original.url}
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-blue-400 text-blue-500 hover:underline"
            >
                {truncateString(stripProtocol(row.original.url), 15)}
            </Link>
        ),
        enableSorting: true,
        enableHiding: true,
        filterFn: "includesString",
    }, {
        id: "slug",
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
            <Link
                href={`/s/${row.original.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-blue-400 text-blue-500 hover:underline"
            >
                {truncateString(row.original.slug, 15)}
            </Link>
        ),
        enableSorting: true,
        enableHiding: true,
        filterFn: "includesString",
    }, {
        id: "expiry",
        accessorKey: "expiry",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        column.toggleSorting(column.getIsSorted() === "asc");
                    }}>
                    Expiry
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }, cell: ({ row }) => {
            const expiryText = row.original.expiry
                ? moment(row.original.expiry).fromNow()
                : "Never";
            const isExpired = row.original.expiry && moment(row.original.expiry).isBefore(moment());

            return (
                <span className={isExpired ? "text-red-500" : ""}>
                    {expiryText}
                </span>
            );
        },
        enableSorting: true,
        enableHiding: true,
        filterFn: "includesString",
    }, {
        id: "created_at",
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) =>
            new Date(row.original.created_at).toLocaleString(),
        enableSorting: true,
        enableHiding: true,
        filterFn: "includesString",
    }, {
        id: "updated_at",
        accessorKey: "updated_at",
        header: "Updated At",
        cell: ({ row }) =>
            new Date(row.original.updated_at).toLocaleString(),
        enableSorting: true,
        enableHiding: true,
        filterFn: "includesString",
    }, {
        id: "valid",
        accessorKey: "valid",
        header: "Valid",
        cell: ({ row }) => (
            <Tooltip>
                <TooltipTrigger>

                    <span
                        className={`${row.original.valid === "valid"
                            ? "text-green-500"
                            : row.original.valid === "invalid"
                                ? "text-red-500"
                                : row.original.valid === "blocked"
                                    ? "bg-red-500 text-white p-1 rounded-md"
                                    : "text-yellow-500"
                            }`}
                    >
                        {row.original.valid}
                    </span>
                </TooltipTrigger>                <TooltipContent>
                    {row.original.valid === "valid"
                        ? "This URL is valid and can be accessed." :
                        row.original.valid === "invalid"
                            ? `This URL is invalid and cannot be accessed: ${row.original.valid_msg}`
                            : row.original.valid === "blocked"
                                ? "This URL has failed our virus testing."
                                : "This URL status is unknown."}
                </TooltipContent>
            </Tooltip>
        ),
        enableSorting: true,
        enableHiding: true,
        filterFn: "equals",
    }, {
        id: "edit",
        header: "Edit",
        cell: ({ row }) => (
            <Button variant="outline" asChild>
                <Link
                    href={`/urls/edit/${row.original.id}`}
                    className="text-blue-400 hover:underline"
                >
                    Edit
                </Link>
            </Button>
        ),
        enableSorting: false,
        enableHiding: true,
    },
    ]; const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState(""); const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "includesString",
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    });

    return (
        <>            <div className="w-full">
            <div className="flex items-center py-4 gap-4 flex-wrap">
                {/* Global Search */}
                <div className="flex-1 min-w-[200px]">
                    <Input
                        placeholder="Search all columns..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full"
                    />
                </div>

                {/* Individual Column Filters */}
                <div className="flex gap-2 flex-wrap">
                    <Input
                        placeholder="Filter URLs..."
                        value={table.getColumn("url")?.getFilterValue() ?? ""}
                        onChange={(e) =>
                            table
                                .getColumn("url")
                                ?.setFilterValue(e.target.value)
                        }
                        className="w-40"
                    />

                    <Input
                        placeholder="Filter Slugs..."
                        value={table.getColumn("slug")?.getFilterValue() ?? ""}
                        onChange={(e) =>
                            table
                                .getColumn("slug")
                                ?.setFilterValue(e.target.value)
                        }
                        className="w-40"
                    />                    <select
                        value={table.getColumn("valid")?.getFilterValue() ?? ""}
                        onChange={(e) =>
                            table
                                .getColumn("valid")
                                ?.setFilterValue(e.target.value || undefined)
                        }
                        className="px-3 py-2 border border-input bg-background rounded-md text-sm w-32"
                    >
                        <option value="">All Status</option>
                        <option value="valid">Valid</option>
                        <option value="invalid">Invalid</option>
                        <option value="unknown">Unknown</option>
                        <option value="blocked">Blocked</option>
                    </select>

                    {/* Clear Filters Button */}
                    <Button
                        variant="outline"
                        onClick={() => {
                            setGlobalFilter("");
                            table.resetColumnFilters();
                        }}
                        className="px-3"
                    >
                        Clear Filters
                    </Button>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"} className="ml-auto">
                            Hide Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column
                                                        .columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s)
                    selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
        </>
    );
}
