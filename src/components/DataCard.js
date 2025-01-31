'use client';

export default function DataCard({ title, value, bg }) {
    return (
        <div className={`px-8 py-4 mb-4 rounded-lg text-center shadow-lg ${bg}`}>
            <h1 className="text-2xl font-bold">{value}</h1>
            <p className="text-lg">{title}</p>
        </div>
    );
}
