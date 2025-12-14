import * as React from "react"
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bar, BarChart, CartesianGrid, XAxis} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button"

import { Check, ChevronsUpDown, House, Clock } from "lucide-react"
import { cn } from "@/lib/utils";
import apiHelper from "@/helpers/apiHelper";

type Status = {
  value: string
  label: string
}
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

const api = new apiHelper()

export default function Player() {
    const { id } = useParams();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const tab = query.get("tab");
    
    const [playerData, setPlayerData] = useState({})
    const [playerTeam, setPlayerTeam] = useState("")
    const [openTeam, setOpenTeam] = useState(false)
    const [openCourt, setOpenCourt] = useState(false);
    const [openLast, setOpenLast] = useState(false);
    const [vsTeamValue, setVsTeamValue] = useState("");
    const [courtValue, setCourtValue] = useState("");
    const [lastXValue, setLastXValue] = useState("");
    const [nextGameData, setNextGameData] = useState({});
    const [boxScoreLastGames, setBoxScoreLastGames] = useState([]);

    const initData = async () => {
        const playerInfo = await api.getPlayerById(id ?? "");
        setPlayerData(playerInfo)
        const playerTeamInfo = await api.getPlayerTeam(id ?? "");
        console.log(playerTeamInfo)
        setPlayerTeam(playerTeamInfo[0].team_abbreviation)
        const nextGame = await api.getPlayerNextGame(
            {
                id: id,
                season: "2025-26",
                season_type: "Regular Season"
            }
        )
        setNextGameData(nextGame[0])

        const boxLastGames = await api.getPlayerGameLog(
            {
                id: id,
                season: "2025-26",
                season_type: null,
                opponent_team_id: null,
                location: null,
            }
        )
        setBoxScoreLastGames(boxLastGames.slice(0, 5))
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

    useEffect(() => {
        console.log(nextGameData);
    }, [nextGameData])

    useEffect(() => {
        console.log(boxScoreLastGames);
    }, [boxScoreLastGames])

    useEffect(() => {
        console.log(playerData);
    }, [playerData])

    useEffect(() => {
        console.log(playerTeam);
    }, [playerTeam])

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
            <div className='grid grid-cols-4 mt-4 gap-4'>
                <div className="flex flex-col gap-4">
                    <Card>
                        <CardHeader>
                            next game
                            <Button 
                                onClick={async () => {
                                    const data = await api.getPlayerById("2544");
                                    console.log(data);
                                }}
                            >
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <img className="h-16 w-16" src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/dal.png" alt="logo" />
                                <p>{nextGameData.home_team_name}</p>
                            </div>
                            <div className="flex items-center text-xs text-gray">
                                <div className="flex items-center">
                                    <House className="ml-auto"/>
                                    <p>American Airlines Center</p>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="ml-auto"/>
                                    <p>Sun, Oct. 26 @ 7:30 PM EST</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            last 5 games box scores
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Opponent</TableHead>
                                        <TableHead>PTS</TableHead>
                                        <TableHead>REB</TableHead>
                                        <TableHead>ASTS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {boxScoreLastGames.map((game, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{game.matchup}</TableCell>
                                            <TableCell>{game.pts}</TableCell>
                                            <TableCell>{game.reb}</TableCell>
                                            <TableCell>{game.ast}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            team standings
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Opponent</TableHead>
                                        <TableHead>PTS</TableHead>
                                        <TableHead>REB</TableHead>
                                        <TableHead>ASTS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">INV001</TableCell>
                                        <TableCell>Paid</TableCell>
                                        <TableCell>C</TableCell>
                                        <TableCell className="text-right">$250.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">INV001</TableCell>
                                        <TableCell>Paid</TableCell>
                                        <TableCell>C</TableCell>
                                        <TableCell className="text-right">$250.00</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-3">
                    <Card>
                        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                            <div>
                                <div className="flex items-center space-x-4">
                                    <p className="text-muted-foreground text-sm">vs.</p>
                                    <Popover open={openTeam} onOpenChange={setOpenTeam}>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openTeam}
                                            className="w-[200px] justify-between"
                                            >
                                            {vsTeamValue
                                                ? frameworks.find((framework) => framework.value === vsTeamValue)?.label
                                                : "Select framework..."}
                                            <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                            <CommandInput placeholder="Search framework..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>No framework found.</CommandEmpty>
                                                <CommandGroup>
                                                {frameworks.map((framework) => (
                                                    <CommandItem
                                                    key={framework.value}
                                                    value={framework.value}
                                                    onSelect={(currentValue) => {
                                                        setVsTeamValue(currentValue === vsTeamValue ? "" : currentValue)
                                                        setOpenTeam(false)
                                                    }}
                                                    >
                                                    {framework.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            vsTeamValue === framework.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    </CommandItem>
                                                ))}
                                                </CommandGroup>
                                            </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <p className="text-muted-foreground text-sm">Court</p>
                                    {/* <Popover open={openCourt} onOpenChange={setOpenCourt}>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openCourt}
                                            className="w-[200px] justify-between"
                                            >
                                            {courtValue
                                                ? frameworks.find((framework) => framework.value === courtValue)?.label
                                                : "Select framework..."}
                                            <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                            <CommandInput placeholder="Search framework..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>No framework found.</CommandEmpty>
                                                <CommandGroup>
                                                {frameworks.map((framework) => (
                                                    <CommandItem
                                                    key={framework.value}
                                                    value={framework.value}
                                                    onSelect={(currentValue) => {
                                                        setCourtValue(currentValue === courtValue ? "" : currentValue)
                                                        setOpenCourt(false)
                                                    }}
                                                    >
                                                    {framework.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            courtValue === framework.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    </CommandItem>
                                                ))}
                                                </CommandGroup>
                                            </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover> */}
                                    <Select>
                                        <SelectTrigger className="font-semibold !text-black">
                                            <SelectValue placeholder="Select a team" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lakers">Los Angeles Lakers</SelectItem>
                                            <SelectItem value="mavs">Dallas Mavericks</SelectItem>
                                            <SelectItem value="dubs">Golden State Warriors</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-muted-foreground text-sm">Last x</p>
                                    {/* <Popover open={openLast} onOpenChange={setOpenLast}>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openLast}
                                            className="w-[200px] justify-between"
                                            >
                                            {lastXValue
                                                ? frameworks.find((framework) => framework.value === lastXValue)?.label
                                                : "Select framework..."}
                                            <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                            <CommandInput placeholder="Search framework..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>No framework found.</CommandEmpty>
                                                <CommandGroup>
                                                {frameworks.map((framework) => (
                                                    <CommandItem
                                                    key={framework.value}
                                                    value={framework.value}
                                                    onSelect={(currentValue) => {
                                                        setLastXValue(currentValue === lastXValue ? "" : currentValue)
                                                        setOpenLast(false)
                                                    }}
                                                    >
                                                    {framework.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            lastXValue === framework.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    </CommandItem>
                                                ))}
                                                </CommandGroup>
                                            </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover> */}
                                    <Select>
                                        <SelectTrigger className="font-semibold !text-black">
                                            <SelectValue placeholder="Select a team" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lakers">Los Angeles Lakers</SelectItem>
                                            <SelectItem value="mavs">Dallas Mavericks</SelectItem>
                                            <SelectItem value="dubs">Golden State Warriors</SelectItem>
                                            <SelectItem value="bla">Portland Trail Blazers</SelectItem>
                                            <SelectItem value="timbs">Minnesota Timberwolves</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent> {/* main filters: stat (PTS, REB, etc.), last x, line*/} {/* advanced filters: vs team, court, without players*/}
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
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}