import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bar, BarChart, CartesianGrid, XAxis} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart"

export default function Player() {
    const [playerData, setPlayerData] = useState({})

    const initData = () => {

    }

    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
        { month: "July", desktop: 214, mobile: 140 },
        { month: "August", desktop: 214, mobile: 140 }
    ]

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#2563eb",
        },
        mobile: {
            label: "Mobile",
            color: "#60a5fa",
        },
    } satisfies ChartConfig

    useEffect(() => {
        initData()
    }, [])

    return (
        <div className="w-full">
            <div className="flex items-center">
                <Avatar className='h-24 w-24'>
                    <AvatarImage src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/dal.png"/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="ml-4 text-5xl font-bold">
                    Player Name
                </div>
            </div>
            <div className='grid grid-cols-4 mt-4'>
                <div className="flex flex-col">
                    <div>testing</div>
                    <div>testing</div>
                </div>
                <div className="col-span-3">
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    )
}