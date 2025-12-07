

const PageLoader = () => {
    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                {/* Header Skeleton */}
                <div className="text-center mb-16 space-y-4">
                    <div className="h-10 bg-slate-200 rounded-2xl w-1/3 mx-auto" />
                    <div className="h-4 bg-slate-200 rounded-xl w-2/3 mx-auto" />
                </div>

                {/* Content Skeleton */}
                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/50 h-64 w-full" />

                {/* Secondary Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-32 bg-white/40 rounded-2xl border border-white/50" />
                    <div className="h-32 bg-white/40 rounded-2xl border border-white/50" />
                    <div className="h-32 bg-white/40 rounded-2xl border border-white/50" />
                </div>
            </div>
        </div>
    );
};

export default PageLoader;
