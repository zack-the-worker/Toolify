import type { Component } from 'vue'
import {
  BracesIcon,
  Exchange01Icon,
  Exchange02Icon,
  Exchange03Icon,
  PercentIcon,
  AmpersandIcon,
  TextWrapIcon,
  BinaryCodeIcon,
  Clock01Icon,
  TranslateIcon,
  Sorting01Icon,
  ColorsIcon,
  FingerPrintIcon,
  TextIcon,
  DiceIcon,
  BinaryIcon,
  GlobeIcon,
  ViewIcon,
  Key01Icon,
  SearchList01Icon,
  GitCompareIcon,
  ZoomIcon,
  TimeScheduleIcon,
  HashIcon,
  TableIcon,
  Notion01Icon,
  QrCodeIcon,
  HtmlFile01Icon,
  CssFile01Icon,
  JavaScriptIcon,
  PaintBrush01Icon,
  PaintBucketIcon,
  CodeXmlIcon,
  DatabaseIcon,
  Certificate01Icon,
  PhpIcon,
  TerminalIcon,
  SourceCodeIcon,
  CodeSquareIcon,
  Svg01Icon,
  CodeCircleIcon,
  Image01Icon,
} from '@hugeicons/core-free-icons'

import JsonTool from './json/JsonTool.vue'
import Base64Tool from './base64/Base64Tool.vue'
import UrlEncodeTool from './urlencode/UrlEncodeTool.vue'
import TimestampTool from './timestamp/TimestampTool.vue'
import HtmlEntityTool from './htmlentity/HtmlEntityTool.vue'
import BackslashTool from './backslash/BackslashTool.vue'
import HexAsciiTool from './hexascii/HexAsciiTool.vue'
import CaseConverterTool from './caseconverter/CaseConverterTool.vue'
import ColorConverterTool from './colorconverter/ColorConverterTool.vue'
import UuidTool from './uuid/UuidTool.vue'
import LoremIpsumTool from './loremipsum/LoremIpsumTool.vue'
import RandomStringTool from './randomstring/RandomStringTool.vue'
import LineSortTool from './linesort/LineSortTool.vue'
import NumberBaseTool from './numberbase/NumberBaseTool.vue'
import UrlParserTool from './urlparser/UrlParserTool.vue'
import HtmlPreviewTool from './htmlpreview/HtmlPreviewTool.vue'
import JwtTool from './jwt/JwtTool.vue'
import RegexTesterTool from './regextester/RegexTesterTool.vue'
import DiffCheckerTool from './diffchecker/DiffCheckerTool.vue'
import StringInspectorTool from './stringinspector/StringInspectorTool.vue'
import CronParserTool from './cronparser/CronParserTool.vue'
import HashGenTool from './hashgen/HashGenTool.vue'
import JsonCsvTool from './jsoncsv/JsonCsvTool.vue'
import YamlJsonTool from './yamljson/YamlJsonTool.vue'
import MarkdownPreviewTool from './markdown/MarkdownPreviewTool.vue'
import QrCodeTool from './qrcode/QrCodeTool.vue'
import HtmlBeautifyTool from './htmlbeautify/HtmlBeautifyTool.vue'
import CssBeautifyTool from './cssbeautify/CssBeautifyTool.vue'
import JsBeautifyTool from './jsbeautify/JsBeautifyTool.vue'
import ScssBeautifyTool from './scssbeautify/ScssBeautifyTool.vue'
import LessBeautifyTool from './lessbeautify/LessBeautifyTool.vue'
import XmlBeautifyTool from './xmlbeautify/XmlBeautifyTool.vue'
import SqlFormatterTool from './sqlformatter/SqlFormatterTool.vue'
import CertDecoderTool from './certdecoder/CertDecoderTool.vue'
import PhpSerializeTool from './phpserialize/PhpSerializeTool.vue'
import PhpJsonTool from './phpjson/PhpJsonTool.vue'
import CurlToCodeTool from './curltocode/CurlToCodeTool.vue'
import JsonToCodeTool from './jsontocode/JsonToCodeTool.vue'
import HtmlToJsxTool from './htmltojsx/HtmlToJsxTool.vue'
import SvgToCssTool from './svgtocss/SvgToCssTool.vue'
import ErbBeautifyTool from './erbbeautify/ErbBeautifyTool.vue'
import Base64ImageTool from './base64image/Base64ImageTool.vue'

// Hugeicons' icon data literals come typed as readonly tuples from
// @hugeicons/core-free-icons, but @hugeicons/vue's HugeiconsIcon prop wants a
// mutable IconArray. The data itself is never mutated, so we widen the type
// here rather than casting at every render site.
export type ToolIcon = readonly (readonly [string, Record<string, string | number>])[]

export interface ToolDef {
  id: string
  name: string
  category: string
  icon: ToolIcon
  component: Component
}

export const tools: ToolDef[] = [
  { id: 'json', name: 'JSON Viewer', category: 'Data', icon: BracesIcon, component: JsonTool },
  { id: 'base64', name: 'Base64', category: 'Encoding', icon: Exchange02Icon, component: Base64Tool },
  { id: 'urlencode', name: 'URL Encode', category: 'Encoding', icon: PercentIcon, component: UrlEncodeTool },
  { id: 'htmlentity', name: 'HTML Entity Encode/Decode', category: 'Encoding', icon: AmpersandIcon, component: HtmlEntityTool },
  { id: 'backslash', name: 'Backslash Escape/Unescape', category: 'Encoding', icon: TextWrapIcon, component: BackslashTool },
  { id: 'hexascii', name: 'Hex ↔ ASCII', category: 'Encoding', icon: BinaryCodeIcon, component: HexAsciiTool },
  { id: 'timestamp', name: 'Timestamp', category: 'Date/Time', icon: Clock01Icon, component: TimestampTool },
  { id: 'caseconverter', name: 'String Case Converter', category: 'Text', icon: TranslateIcon, component: CaseConverterTool },
  { id: 'linesort', name: 'Line Sort/Dedupe', category: 'Text', icon: Sorting01Icon, component: LineSortTool },
  { id: 'colorconverter', name: 'Color Converter', category: 'Design', icon: ColorsIcon, component: ColorConverterTool },
  { id: 'uuid', name: 'UUID/ULID Generate/Decode', category: 'Generators', icon: FingerPrintIcon, component: UuidTool },
  { id: 'loremipsum', name: 'Lorem Ipsum Generator', category: 'Generators', icon: TextIcon, component: LoremIpsumTool },
  { id: 'randomstring', name: 'Random String Generator', category: 'Generators', icon: DiceIcon, component: RandomStringTool },
  { id: 'numberbase', name: 'Number Base Converter', category: 'Data', icon: BinaryIcon, component: NumberBaseTool },
  { id: 'urlparser', name: 'URL Parser', category: 'Data', icon: GlobeIcon, component: UrlParserTool },
  { id: 'htmlpreview', name: 'HTML Preview', category: 'Web', icon: ViewIcon, component: HtmlPreviewTool },
  { id: 'jwt', name: 'JWT Debugger', category: 'Data', icon: Key01Icon, component: JwtTool },
  { id: 'regextester', name: 'RegExp Tester', category: 'Text', icon: SearchList01Icon, component: RegexTesterTool },
  { id: 'diffchecker', name: 'Text Diff Checker', category: 'Text', icon: GitCompareIcon, component: DiffCheckerTool },
  { id: 'stringinspector', name: 'String Inspector', category: 'Text', icon: ZoomIcon, component: StringInspectorTool },
  { id: 'cronparser', name: 'Cron Job Parser', category: 'Date/Time', icon: TimeScheduleIcon, component: CronParserTool },
  { id: 'hashgen', name: 'Hash Generator', category: 'Generators', icon: HashIcon, component: HashGenTool },
  { id: 'jsoncsv', name: 'JSON ↔ CSV', category: 'Data', icon: TableIcon, component: JsonCsvTool },
  { id: 'yamljson', name: 'YAML ↔ JSON', category: 'Data', icon: Exchange01Icon, component: YamlJsonTool },
  { id: 'markdown', name: 'Markdown Preview', category: 'Web', icon: Notion01Icon, component: MarkdownPreviewTool },
  { id: 'qrcode', name: 'QR Code Reader/Generator', category: 'Generators', icon: QrCodeIcon, component: QrCodeTool },
  { id: 'htmlbeautify', name: 'HTML Beautify/Minify', category: 'Beautify', icon: HtmlFile01Icon, component: HtmlBeautifyTool },
  { id: 'cssbeautify', name: 'CSS Beautify/Minify', category: 'Beautify', icon: CssFile01Icon, component: CssBeautifyTool },
  { id: 'jsbeautify', name: 'JS Beautify/Minify', category: 'Beautify', icon: JavaScriptIcon, component: JsBeautifyTool },
  { id: 'scssbeautify', name: 'SCSS Beautify/Minify', category: 'Beautify', icon: PaintBrush01Icon, component: ScssBeautifyTool },
  { id: 'lessbeautify', name: 'LESS Beautify/Minify', category: 'Beautify', icon: PaintBucketIcon, component: LessBeautifyTool },
  { id: 'xmlbeautify', name: 'XML Beautify/Minify', category: 'Beautify', icon: CodeXmlIcon, component: XmlBeautifyTool },
  { id: 'sqlformatter', name: 'SQL Formatter', category: 'Beautify', icon: DatabaseIcon, component: SqlFormatterTool },
  { id: 'certdecoder', name: 'Certificate Decoder', category: 'Data', icon: Certificate01Icon, component: CertDecoderTool },
  { id: 'phpserialize', name: 'PHP Serializer/Unserializer', category: 'Data', icon: PhpIcon, component: PhpSerializeTool },
  { id: 'phpjson', name: 'PHP ↔ JSON', category: 'Data', icon: Exchange03Icon, component: PhpJsonTool },
  { id: 'curltocode', name: 'cURL to Code', category: 'Codegen', icon: TerminalIcon, component: CurlToCodeTool },
  { id: 'jsontocode', name: 'JSON to Code', category: 'Codegen', icon: SourceCodeIcon, component: JsonToCodeTool },
  { id: 'htmltojsx', name: 'HTML to JSX', category: 'Codegen', icon: CodeSquareIcon, component: HtmlToJsxTool },
  { id: 'svgtocss', name: 'SVG to CSS', category: 'Design', icon: Svg01Icon, component: SvgToCssTool },
  { id: 'erbbeautify', name: 'ERB Beautify/Minify', category: 'Beautify', icon: CodeCircleIcon, component: ErbBeautifyTool },
  { id: 'base64image', name: 'Base64 Image Encode/Decode', category: 'Encoding', icon: Image01Icon, component: Base64ImageTool },
]

export const toolCategories = [...new Set(tools.map((t) => t.category))]
