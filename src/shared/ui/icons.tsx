import { lazy, Suspense, type LazyExoticComponent } from 'react'
import type { LucideIcon, LucideProps } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

const iconImporters = {
  Activity: () => import('lucide-react/dist/esm/icons/activity.js'),
  AlertCircle: () => import('lucide-react/dist/esm/icons/alert-circle.js'),
  AlertTriangle: () => import('lucide-react/dist/esm/icons/alert-triangle.js'),
  ArrowDown: () => import('lucide-react/dist/esm/icons/arrow-down.js'),
  ArrowLeft: () => import('lucide-react/dist/esm/icons/arrow-left.js'),
  ArrowRight: () => import('lucide-react/dist/esm/icons/arrow-right.js'),
  ArrowUp: () => import('lucide-react/dist/esm/icons/arrow-up.js'),
  BarChart3: () => import('lucide-react/dist/esm/icons/bar-chart-3.js'),
  Bell: () => import('lucide-react/dist/esm/icons/bell.js'),
  Calendar: () => import('lucide-react/dist/esm/icons/calendar.js'),
  Check: () => import('lucide-react/dist/esm/icons/check.js'),
  CheckCircle: () => import('lucide-react/dist/esm/icons/check-circle.js'),
  ChevronsLeft: () => import('lucide-react/dist/esm/icons/chevrons-left.js'),
  ChevronsRight: () => import('lucide-react/dist/esm/icons/chevrons-right.js'),
  ChevronDown: () => import('lucide-react/dist/esm/icons/chevron-down.js'),
  ChevronLeft: () => import('lucide-react/dist/esm/icons/chevron-left.js'),
  ChevronRight: () => import('lucide-react/dist/esm/icons/chevron-right.js'),
  ClipboardList: () => import('lucide-react/dist/esm/icons/clipboard-list.js'),
  Compass: () => import('lucide-react/dist/esm/icons/compass.js'),
  Edit2: () => import('lucide-react/dist/esm/icons/edit-2.js'),
  Flag: () => import('lucide-react/dist/esm/icons/flag.js'),
  File: () => import('lucide-react/dist/esm/icons/file.js'),
  FileDown: () => import('lucide-react/dist/esm/icons/file-down.js'),
  FileSpreadsheet: () => import('lucide-react/dist/esm/icons/file-spreadsheet.js'),
  FileText: () => import('lucide-react/dist/esm/icons/file-text.js'),
  Filter: () => import('lucide-react/dist/esm/icons/filter.js'),
  Gauge: () => import('lucide-react/dist/esm/icons/gauge.js'),
  GitBranch: () => import('lucide-react/dist/esm/icons/git-branch.js'),
  Home: () => import('lucide-react/dist/esm/icons/home.js'),
  Inbox: () => import('lucide-react/dist/esm/icons/inbox.js'),
  Info: () => import('lucide-react/dist/esm/icons/info.js'),
  Keyboard: () => import('lucide-react/dist/esm/icons/keyboard.js'),
  LayoutDashboard: () => import('lucide-react/dist/esm/icons/layout-dashboard.js'),
  Loader2: () => import('lucide-react/dist/esm/icons/loader-2.js'),
  Lock: () => import('lucide-react/dist/esm/icons/lock.js'),
  LogOut: () => import('lucide-react/dist/esm/icons/log-out.js'),
  Mail: () => import('lucide-react/dist/esm/icons/mail.js'),
  Menu: () => import('lucide-react/dist/esm/icons/menu.js'),
  MessageSquare: () => import('lucide-react/dist/esm/icons/message-square.js'),
  Minus: () => import('lucide-react/dist/esm/icons/minus.js'),
  Moon: () => import('lucide-react/dist/esm/icons/moon.js'),
  Paperclip: () => import('lucide-react/dist/esm/icons/paperclip.js'),
  Plus: () => import('lucide-react/dist/esm/icons/plus.js'),
  RefreshCw: () => import('lucide-react/dist/esm/icons/refresh-cw.js'),
  Search: () => import('lucide-react/dist/esm/icons/search.js'),
  Send: () => import('lucide-react/dist/esm/icons/send.js'),
  Settings: () => import('lucide-react/dist/esm/icons/settings.js'),
  Shield: () => import('lucide-react/dist/esm/icons/shield.js'),
  ShieldAlert: () => import('lucide-react/dist/esm/icons/shield-alert.js'),
  Star: () => import('lucide-react/dist/esm/icons/star.js'),
  Sun: () => import('lucide-react/dist/esm/icons/sun.js'),
  Target: () => import('lucide-react/dist/esm/icons/target.js'),
  Trash2: () => import('lucide-react/dist/esm/icons/trash-2.js'),
  TrendingDown: () => import('lucide-react/dist/esm/icons/trending-down.js'),
  TrendingUp: () => import('lucide-react/dist/esm/icons/trending-up.js'),
  Upload: () => import('lucide-react/dist/esm/icons/upload.js'),
  User: () => import('lucide-react/dist/esm/icons/user.js'),
  UserCheck: () => import('lucide-react/dist/esm/icons/user-check.js'),
  UserX: () => import('lucide-react/dist/esm/icons/user-x.js'),
  Users: () => import('lucide-react/dist/esm/icons/users.js'),
  Wallet: () => import('lucide-react/dist/esm/icons/wallet.js'),
  X: () => import('lucide-react/dist/esm/icons/x.js'),
  Layers: () => import('lucide-react/dist/esm/icons/layers.js'),
  Building2: () => import('lucide-react/dist/esm/icons/building-2.js'),
  Zap: () => import('lucide-react/dist/esm/icons/zap.js'),
  PanelTop: () => import('lucide-react/dist/esm/icons/panel-top.js'),
  Lightbulb: () => import('lucide-react/dist/esm/icons/lightbulb.js'),
  LineChart: () => import('lucide-react/dist/esm/icons/line-chart.js'),
  Database: () => import('lucide-react/dist/esm/icons/database.js'),
  ScrollText: () => import('lucide-react/dist/esm/icons/scroll-text.js'),
  ShieldCheck: () => import('lucide-react/dist/esm/icons/shield-check.js'),
  KeyRound: () => import('lucide-react/dist/esm/icons/key-round.js'),
  MapIcon: () => import('lucide-react/dist/esm/icons/map.js'),
  Rocket: () => import('lucide-react/dist/esm/icons/rocket.js'),
  UsersRound: () => import('lucide-react/dist/esm/icons/users-round.js'),
  Link2: () => import('lucide-react/dist/esm/icons/link-2.js'),
  Briefcase: () => import('lucide-react/dist/esm/icons/briefcase.js'),
  Clock: () => import('lucide-react/dist/esm/icons/clock.js'),
  Timer: () => import('lucide-react/dist/esm/icons/timer.js'),
  GripVertical: () => import('lucide-react/dist/esm/icons/grip-vertical.js'),
  Play: () => import('lucide-react/dist/esm/icons/play.js'),
  Pause: () => import('lucide-react/dist/esm/icons/pause.js'),
  RotateCcw: () => import('lucide-react/dist/esm/icons/rotate-ccw.js'),
  Eye: () => import('lucide-react/dist/esm/icons/eye.js'),
  EyeOff: () => import('lucide-react/dist/esm/icons/eye-off.js'),
  Copy: () => import('lucide-react/dist/esm/icons/copy.js'),
  MoreHorizontal: () => import('lucide-react/dist/esm/icons/more-horizontal.js'),
  MoreVertical: () => import('lucide-react/dist/esm/icons/more-vertical.js'),
  Folder: () => import('lucide-react/dist/esm/icons/folder.js'),
  FolderOpen: () => import('lucide-react/dist/esm/icons/folder-open.js'),
  CircleDot: () => import('lucide-react/dist/esm/icons/circle-dot.js'),
  Circle: () => import('lucide-react/dist/esm/icons/circle.js'),
  Square: () => import('lucide-react/dist/esm/icons/square.js'),
  CheckSquare: () => import('lucide-react/dist/esm/icons/check-square.js'),
  ListTodo: () => import('lucide-react/dist/esm/icons/list-todo.js'),
  Kanban: () => import('lucide-react/dist/esm/icons/kanban.js'),
  GanttChart: () => import('lucide-react/dist/esm/icons/gantt-chart.js'),
  PieChart: () => import('lucide-react/dist/esm/icons/pie-chart.js'),
  AreaChart: () => import('lucide-react/dist/esm/icons/area-chart.js'),
  CalendarDays: () => import('lucide-react/dist/esm/icons/calendar-days.js'),
  CalendarCheck: () => import('lucide-react/dist/esm/icons/calendar-check.js'),
  Link: () => import('lucide-react/dist/esm/icons/link.js'),
  Unlink: () => import('lucide-react/dist/esm/icons/unlink.js'),
  ExternalLink: () => import('lucide-react/dist/esm/icons/external-link.js'),
  Download: () => import('lucide-react/dist/esm/icons/download.js'),
  Milestone: () => import('lucide-react/dist/esm/icons/milestone.js'),
  Hash: () => import('lucide-react/dist/esm/icons/hash.js'),
  AtSign: () => import('lucide-react/dist/esm/icons/at-sign.js'),
  DollarSign: () => import('lucide-react/dist/esm/icons/dollar-sign.js'),
  Percent: () => import('lucide-react/dist/esm/icons/percent.js'),
  HelpCircle: () => import('lucide-react/dist/esm/icons/help-circle.js'),
  AlertOctagon: () => import('lucide-react/dist/esm/icons/alert-octagon.js'),
  Ban: () => import('lucide-react/dist/esm/icons/ban.js'),
  XCircle: () => import('lucide-react/dist/esm/icons/x-circle.js'),
  Sparkles: () => import('lucide-react/dist/esm/icons/sparkles.js'),
  Award: () => import('lucide-react/dist/esm/icons/award.js'),
  Trophy: () => import('lucide-react/dist/esm/icons/trophy.js'),
  Plane: () => import('lucide-react/dist/esm/icons/plane.js'),
  PlaneTakeoff: () => import('lucide-react/dist/esm/icons/plane-takeoff.js'),
  PlaneLanding: () => import('lucide-react/dist/esm/icons/plane-landing.js'),
  FolderKanban: () => import('lucide-react/dist/esm/icons/folder-kanban.js'),
  FileCheck: () => import('lucide-react/dist/esm/icons/file-check.js'),
  FilePlus: () => import('lucide-react/dist/esm/icons/file-plus.js'),
  History: () => import('lucide-react/dist/esm/icons/history.js'),
  Edit3: () => import('lucide-react/dist/esm/icons/edit-3.js'),
  FileSearch: () => import('lucide-react/dist/esm/icons/file-search.js'),
  Boxes: () => import('lucide-react/dist/esm/icons/boxes.js'),
  Files: () => import('lucide-react/dist/esm/icons/files.js'),
  Archive: () => import('lucide-react/dist/esm/icons/archive.js'),
  ImageIcon: () => import('lucide-react/dist/esm/icons/image.js'),
  Tag: () => import('lucide-react/dist/esm/icons/tag.js'),
  Wand2: () => import('lucide-react/dist/esm/icons/wand-2.js'),
  ListIcon: () => import('lucide-react/dist/esm/icons/list.js'),
  LayoutGrid: () => import('lucide-react/dist/esm/icons/layout-grid.js'),
  Columns3: () => import('lucide-react/dist/esm/icons/columns-3.js'),
  ChevronUp: () => import('lucide-react/dist/esm/icons/chevron-up.js'),
  CheckCircle2: () => import('lucide-react/dist/esm/icons/check-circle-2.js'),
  Save: () => import('lucide-react/dist/esm/icons/save.js'),
} as const

type IconAlias = keyof typeof iconImporters

const iconCache = new Map<IconAlias, LazyExoticComponent<LucideIcon>>()

function lazyIcon(name: IconAlias) {
  let LazyIconComponent = iconCache.get(name)

  if (!LazyIconComponent) {
    const iconImport = iconImporters[name]

    if (!iconImport) {
      throw new Error(`Lucide icon "${String(name)}" not found`)
    }

    LazyIconComponent = lazy(
      iconImport as () => Promise<{ default: LucideIcon }>
    )

    iconCache.set(name, LazyIconComponent)
  }

  const WrappedIcon = (props: LucideProps) => {
    const { ref: _ref, ...rest } = props

    return (
      <Suspense
        fallback={<span className={cn('inline-block', rest.className)} aria-hidden="true" />}
      >
        <LazyIconComponent {...rest} />
      </Suspense>
    )
  }

  WrappedIcon.displayName = `LazyLucide(${String(name)})`

  return WrappedIcon
}

export const Activity = lazyIcon('Activity')
export const AlertCircle = lazyIcon('AlertCircle')
export const AlertTriangle = lazyIcon('AlertTriangle')
export const ArrowDown = lazyIcon('ArrowDown')
export const ArrowLeft = lazyIcon('ArrowLeft')
export const ArrowRight = lazyIcon('ArrowRight')
export const ArrowUp = lazyIcon('ArrowUp')
export const BarChart3 = lazyIcon('BarChart3')
export const Bell = lazyIcon('Bell')
export const Calendar = lazyIcon('Calendar')
export const Check = lazyIcon('Check')
export const CheckCircle = lazyIcon('CheckCircle')
export const ChevronsLeft = lazyIcon('ChevronsLeft')
export const ChevronsRight = lazyIcon('ChevronsRight')
export const ChevronDown = lazyIcon('ChevronDown')
export const ChevronLeft = lazyIcon('ChevronLeft')
export const ChevronRight = lazyIcon('ChevronRight')
export const ClipboardList = lazyIcon('ClipboardList')
export const Compass = lazyIcon('Compass')
export const Edit2 = lazyIcon('Edit2')
export const Flag = lazyIcon('Flag')
export const File = lazyIcon('File')
export const FileDown = lazyIcon('FileDown')
export const FileSpreadsheet = lazyIcon('FileSpreadsheet')
export const FileText = lazyIcon('FileText')
export const Filter = lazyIcon('Filter')
export const Gauge = lazyIcon('Gauge')
export const GitBranch = lazyIcon('GitBranch')
export const Home = lazyIcon('Home')
export const Inbox = lazyIcon('Inbox')
export const Info = lazyIcon('Info')
export const Keyboard = lazyIcon('Keyboard')
export const LayoutDashboard = lazyIcon('LayoutDashboard')
export const Loader2 = lazyIcon('Loader2')
export const Lock = lazyIcon('Lock')
export const LogOut = lazyIcon('LogOut')
export const Mail = lazyIcon('Mail')
export const Menu = lazyIcon('Menu')
export const Moon = lazyIcon('Moon')
export const MessageSquare = lazyIcon('MessageSquare')
export const Minus = lazyIcon('Minus')
export const Plus = lazyIcon('Plus')
export const Paperclip = lazyIcon('Paperclip')
export const RefreshCw = lazyIcon('RefreshCw')
export const Search = lazyIcon('Search')
export const Send = lazyIcon('Send')
export const Settings = lazyIcon('Settings')
export const Shield = lazyIcon('Shield')
export const ShieldAlert = lazyIcon('ShieldAlert')
export const Star = lazyIcon('Star')
export const Sun = lazyIcon('Sun')
export const Target = lazyIcon('Target')
export const Trash2 = lazyIcon('Trash2')
export const TrendingDown = lazyIcon('TrendingDown')
export const TrendingUp = lazyIcon('TrendingUp')
export const Upload = lazyIcon('Upload')
export const User = lazyIcon('User')
export const UserCheck = lazyIcon('UserCheck')
export const UserX = lazyIcon('UserX')
export const Users = lazyIcon('Users')
export const Wallet = lazyIcon('Wallet')
export const X = lazyIcon('X')
export const Layers = lazyIcon('Layers')
export const Building2 = lazyIcon('Building2')
export const Zap = lazyIcon('Zap')
export const PanelTop = lazyIcon('PanelTop')
export const Lightbulb = lazyIcon('Lightbulb')
export const LineChart = lazyIcon('LineChart')
export const Database = lazyIcon('Database')
export const ScrollText = lazyIcon('ScrollText')
export const ShieldCheck = lazyIcon('ShieldCheck')
export const KeyRound = lazyIcon('KeyRound')
export const MapIcon = lazyIcon('MapIcon')
export const Rocket = lazyIcon('Rocket')
export const UsersRound = lazyIcon('UsersRound')
export const Link2 = lazyIcon('Link2')
export const Briefcase = lazyIcon('Briefcase')
export const Clock = lazyIcon('Clock')
export const Timer = lazyIcon('Timer')
export const GripVertical = lazyIcon('GripVertical')
export const Play = lazyIcon('Play')
export const Pause = lazyIcon('Pause')
export const RotateCcw = lazyIcon('RotateCcw')
export const Eye = lazyIcon('Eye')
export const EyeOff = lazyIcon('EyeOff')
export const Copy = lazyIcon('Copy')
export const MoreHorizontal = lazyIcon('MoreHorizontal')
export const MoreVertical = lazyIcon('MoreVertical')
export const Folder = lazyIcon('Folder')
export const FolderOpen = lazyIcon('FolderOpen')
export const CircleDot = lazyIcon('CircleDot')
export const Circle = lazyIcon('Circle')
export const Square = lazyIcon('Square')
export const CheckSquare = lazyIcon('CheckSquare')
export const ListTodo = lazyIcon('ListTodo')
export const Kanban = lazyIcon('Kanban')
export const GanttChart = lazyIcon('GanttChart')
export const PieChart = lazyIcon('PieChart')
export const AreaChart = lazyIcon('AreaChart')
export const CalendarDays = lazyIcon('CalendarDays')
export const CalendarCheck = lazyIcon('CalendarCheck')
export const Link = lazyIcon('Link')
export const Unlink = lazyIcon('Unlink')
export const ExternalLink = lazyIcon('ExternalLink')
export const Download = lazyIcon('Download')
export const Milestone = lazyIcon('Milestone')
export const Hash = lazyIcon('Hash')
export const AtSign = lazyIcon('AtSign')
export const DollarSign = lazyIcon('DollarSign')
export const Percent = lazyIcon('Percent')
export const HelpCircle = lazyIcon('HelpCircle')
export const AlertOctagon = lazyIcon('AlertOctagon')
export const Ban = lazyIcon('Ban')
export const XCircle = lazyIcon('XCircle')
export const Sparkles = lazyIcon('Sparkles')
export const Award = lazyIcon('Award')
export const Trophy = lazyIcon('Trophy')
export const Plane = lazyIcon('Plane')
export const PlaneTakeoff = lazyIcon('PlaneTakeoff')
export const PlaneLanding = lazyIcon('PlaneLanding')
export const FolderKanban = lazyIcon('FolderKanban')
export const FileCheck = lazyIcon('FileCheck')
export const FilePlus = lazyIcon('FilePlus')
export const History = lazyIcon('History')
export const Edit3 = lazyIcon('Edit3')
export const FileSearch = lazyIcon('FileSearch')
export const Boxes = lazyIcon('Boxes')
export const Files = lazyIcon('Files')
export const Archive = lazyIcon('Archive')
export const ImageIcon = lazyIcon('ImageIcon')
export const Tag = lazyIcon('Tag')
export const Wand2 = lazyIcon('Wand2')
export const ListIcon = lazyIcon('ListIcon')
export const LayoutGrid = lazyIcon('LayoutGrid')
export const Columns3 = lazyIcon('Columns3')
export const ChevronUp = lazyIcon('ChevronUp')
export const CheckCircle2 = lazyIcon('CheckCircle2')
export const Save = lazyIcon('Save')
