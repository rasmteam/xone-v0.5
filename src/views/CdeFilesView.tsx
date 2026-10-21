import React, { useState, useMemo } from 'react';
import { CdeDocument, CdeFolder } from '../types';
import { CDE_FOLDERS } from '../data/mockData';

interface CdeFilesViewProps {
  documents: CdeDocument[];
  onOpenDocumentDossier: (docId: string) => void;
  onOpenUpload: () => void;
  onTriggerToast: (title: string, desc: string, type?: 'success' | 'error' | 'info') => void;
  onOpenExcelIpc?: (doc?: CdeDocument) => void;
  /** Folder pre-selected when the view mounts (e.g. deep-linked from dashboard cards) */
  initialFolderId?: string;
}

export const CdeFilesView: React.FC<CdeFilesViewProps> = ({
  documents,
  onOpenDocumentDossier,
  onOpenUpload,
  onTriggerToast,
  onOpenExcelIpc,
  initialFolderId
}) => {
  // Currently active folder ID in the tree (Default: XON-0000-XXX-PHASE 1 as requested)
  const [selectedFolderId, setSelectedFolderId] = useState<string>(initialFolderId || 'f-ph1');
  const [folderSearch, setFolderSearch] = useState('');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'f-ph1': true,
    'f-ph1-arc': true,
    'f-arc-revit': true,
    'f-doc': false
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  // Auto-expand ancestors of the pre-selected folder so it is visible in the tree
  React.useEffect(() => {
    const info = findFolderInfo(CDE_FOLDERS, selectedFolderId);
    if (info && info.ancestors.length > 0) {
      setExpandedFolders((prev) => {
        const next = { ...prev };
        info.ancestors.forEach((a) => { next[a.id] = true; });
        return next;
      });
    }
  }, [selectedFolderId]);

  // Helper: Find folder and its ancestors recursively
  const findFolderInfo = (
    folders: CdeFolder[],
    targetId: string,
    ancestors: CdeFolder[] = []
  ): { target: CdeFolder; ancestors: CdeFolder[] } | null => {
    for (const f of folders) {
      if (f.id === targetId) {
        return { target: f, ancestors };
      }
      if (f.children && f.children.length > 0) {
        const found = findFolderInfo(f.children, targetId, [...ancestors, f]);
        if (found) return found;
      }
    }
    return null;
  };

  const folderInfo = useMemo(() => {
    return findFolderInfo(CDE_FOLDERS, selectedFolderId) || {
      target: CDE_FOLDERS[2], // default: XON-0000-XXX-PHASE 1
      ancestors: []
    };
  }, [selectedFolderId]);

  const currentFolder = folderInfo.target;
  const parentFolder = folderInfo.ancestors.length > 0 ? folderInfo.ancestors[folderInfo.ancestors.length - 1] : null;
  const subFolders = currentFolder.children || [];

  // Helper: recursively collect all folder IDs in a folder branch
  const collectFolderIds = (folder: CdeFolder): string[] => {
    let ids = [folder.id];
    if (folder.children) {
      for (const child of folder.children) {
        ids = ids.concat(collectFolderIds(child));
      }
    }
    return ids;
  };

  const currentBranchFolderIds = useMemo(() => {
    return new Set(collectFolderIds(currentFolder));
  }, [currentFolder]);

  // Filter documents dynamically according to the selected folder and format
  const filteredDocs = useMemo(() => {
    return documents.filter((d) => {
      // 1. Folder match: direct match or child in this branch or path match
      const matchFolder =
        (d.folderId && currentBranchFolderIds.has(d.folderId)) ||
        (d.folderPath && (d.folderPath.includes(currentFolder.name) || d.folderPath.includes(currentFolder.path)));

      if (!matchFolder) return false;

      // 2. Format filter
      if (formatFilter !== 'all' && d.format !== formatFilter) return false;

      return true;
    });
  }, [documents, currentFolder, currentBranchFolderIds, formatFilter]);

  // Handle clicking a folder anywhere (in tree or in subfolder card)
  const handleSelectFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    setFormatFilter('all');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8" dir="rtl">
      {/* Top Banner & Interactive Breadcrumbs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
          <span className="material-symbols-outlined text-[#00716B] text-lg">folder_open</span>
          <span className="font-bold text-slate-800">پایگاه داده CDE</span>
          <span>/</span>
          <span className="text-slate-600">مخزن مرکزی باران Xone</span>
          {folderInfo.ancestors.map((anc) => (
            <React.Fragment key={anc.id}>
              <span>/</span>
              <button
                onClick={() => handleSelectFolder(anc.id)}
                className="hover:text-[#00716B] hover:underline font-mono text-slate-700 cursor-pointer"
              >
                {anc.name}
              </button>
            </React.Fragment>
          ))}
          <span>/</span>
          <span className="font-bold text-[#00716B] bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200 font-mono">
            {currentFolder.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            مخزن زنده و متصل به سرور مرکزی CDE-BIM
          </span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            ISO 19650-2:2018
          </span>
        </div>
      </div>

      {/* Main 2-Column CDE Layout: WBS Tree (Right) + Folder Contents & Files (Left) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================
            RIGHT COLUMN: WBS FOLDER TREE (4 Cols)
            ========================================================= */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00716B] text-xl">account_tree</span>
              <h2 className="text-sm font-bold text-slate-900">ساختار درختی مخزن اسناد CDE</h2>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
              ISO WBS
            </span>
          </div>

          {/* Folder Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-slate-400 text-sm">
              filter_alt
            </span>
            <input
              type="text"
              value={folderSearch}
              onChange={(e) => setFolderSearch(e.target.value)}
              placeholder="فیلتر شاخه‌ها یا کد دیسیپلین..."
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pr-8 pl-3 py-1.5 text-slate-800 outline-none focus:border-[#00716B]"
            />
          </div>

          {/* Folder Hierarchy Tree */}
          <div className="space-y-1 text-xs max-h-[640px] overflow-y-auto pr-1">
            {/* Root 1: DOCUMENT */}
            <div className="space-y-1">
              <div
                onClick={() => handleSelectFolder('f-doc')}
                className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                  selectedFolderId === 'f-doc'
                    ? 'bg-[#00716B]/10 text-[#00716B] font-bold border border-[#00716B]/30'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolder('f-doc');
                    }}
                    className="material-symbols-outlined text-slate-400 text-sm hover:text-slate-700"
                  >
                    {expandedFolders['f-doc'] ? 'expand_more' : 'chevron_left'}
                  </span>
                  <span className="material-symbols-outlined text-amber-500 text-base">folder</span>
                  <span className="font-mono text-[11px]">XON-0000-XXX-DOCUMENT</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">۲ فایل</span>
              </div>

              {expandedFolders['f-doc'] && (
                <div className="mr-5 space-y-1 border-r border-slate-200 pr-2">
                  <div
                    onClick={() => handleSelectFolder('f-doc-contracts')}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                      selectedFolderId === 'f-doc-contracts'
                        ? 'bg-[#00716B] text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs">description</span>
                      <span>قراردادها و الحاقیه‌ها</span>
                    </div>
                    <span className="text-[10px] opacity-80">۱</span>
                  </div>
                  <div
                    onClick={() => handleSelectFolder('f-doc-specs')}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                      selectedFolderId === 'f-doc-specs'
                        ? 'bg-[#00716B] text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs">gavel</span>
                      <span>مشخصات فنی و ضوابط</span>
                    </div>
                    <span className="text-[10px] opacity-80">۱</span>
                  </div>
                </div>
              )}
            </div>

            {/* Root 2: IMPORT */}
            <div
              onClick={() => handleSelectFolder('f-import')}
              className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                selectedFolderId === 'f-import'
                  ? 'bg-[#00716B]/10 text-[#00716B] font-bold border border-[#00716B]/30'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-3"></span>
                <span className="material-symbols-outlined text-amber-500 text-base">folder</span>
                <span className="font-mono text-[11px]">XON-0000-XXX-IMPORT</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">۱ سند</span>
            </div>

            {/* Root 3: PHASE 1 */}
            <div className="space-y-1">
              <div
                onClick={() => handleSelectFolder('f-ph1')}
                className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                  selectedFolderId === 'f-ph1'
                    ? 'bg-[#00716B]/10 text-[#00716B] font-bold border border-[#00716B]/30'
                    : 'hover:bg-slate-50 text-slate-800 font-semibold'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolder('f-ph1');
                    }}
                    className="material-symbols-outlined text-slate-400 text-sm hover:text-slate-700"
                  >
                    {expandedFolders['f-ph1'] ? 'expand_more' : 'chevron_left'}
                  </span>
                  <span className="material-symbols-outlined text-amber-500 text-base">folder_special</span>
                  <span className="font-mono text-[11px]">XON-0000-XXX-PHASE 1</span>
                </div>
                <span className="text-[10px] bg-teal-50 text-[#00716B] font-bold px-1.5 py-0.5 rounded border border-teal-200">
                  ۲۴ فایل
                </span>
              </div>

              {expandedFolders['f-ph1'] && (
                <div className="mr-3 space-y-1 border-r border-slate-200 pr-2">
                  {/* Sub 1: ARC (Architecture) */}
                  <div className="space-y-1">
                    <div
                      onClick={() => handleSelectFolder('f-ph1-arc')}
                      className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                        selectedFolderId === 'f-ph1-arc'
                          ? 'bg-[#00716B]/15 text-[#00716B] font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFolder('f-ph1-arc');
                          }}
                          className="material-symbols-outlined text-slate-400 text-xs hover:text-slate-700"
                        >
                          {expandedFolders['f-ph1-arc'] ? 'expand_more' : 'chevron_left'}
                        </span>
                        <span className="material-symbols-outlined text-amber-500 text-sm">folder</span>
                        <span className="font-mono text-[11px]">PH1-ARC (معماری)</span>
                      </div>
                      <span className="text-[10px] text-slate-400">۱۴ فایل</span>
                    </div>

                    {expandedFolders['f-ph1-arc'] && (
                      <div className="mr-4 space-y-1 border-r border-slate-200 pr-2">
                        <div
                          onClick={() => handleSelectFolder('f-arc-3dmax')}
                          className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                            selectedFolderId === 'f-arc-3dmax'
                              ? 'bg-[#00716B] text-white font-bold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs">folder</span>
                            <span className="font-mono text-[11px]">3DMAX</span>
                          </div>
                          <span className="text-[10px] opacity-80">۲</span>
                        </div>

                        <div
                          onClick={() => handleSelectFolder('f-arc-cad')}
                          className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                            selectedFolderId === 'f-arc-cad'
                              ? 'bg-[#00716B] text-white font-bold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs">folder</span>
                            <span className="font-mono text-[11px]">CAD (پلان‌ها)</span>
                          </div>
                          <span className="text-[10px] opacity-80">۳</span>
                        </div>

                        {/* REVIT Folder */}
                        <div className="space-y-1">
                          <div
                            onClick={() => handleSelectFolder('f-arc-revit')}
                            className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                              selectedFolderId === 'f-arc-revit'
                                ? 'bg-[#00716B]/15 text-[#00716B] font-bold'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFolder('f-arc-revit');
                                }}
                                className="material-symbols-outlined text-xs text-slate-400"
                              >
                                {expandedFolders['f-arc-revit'] ? 'expand_more' : 'chevron_left'}
                              </span>
                              <span className="material-symbols-outlined text-teal-600 text-sm">folder</span>
                              <span className="font-mono text-[11px]">PH1-ARC-REVIT</span>
                            </div>
                            <span className="text-[10px] text-teal-700 font-bold font-mono">۷</span>
                          </div>

                          {expandedFolders['f-arc-revit'] && (
                            <div className="mr-4 space-y-1 border-r border-[#00716B]/30 pr-2">
                              <div
                                onClick={() => handleSelectFolder('f-revit-3d')}
                                className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                                  selectedFolderId === 'f-revit-3d'
                                    ? 'bg-[#00716B] text-white font-bold shadow-xs'
                                    : 'text-slate-700 hover:bg-teal-50'
                                }`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-xs">view_in_ar</span>
                                  <span>3D model</span>
                                </div>
                                <span className="text-[10px] opacity-90 font-mono">۴ فایل</span>
                              </div>

                              <div
                                onClick={() => handleSelectFolder('f-revit-anim')}
                                className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                                  selectedFolderId === 'f-revit-anim'
                                    ? 'bg-[#00716B] text-white font-bold shadow-xs'
                                    : 'text-slate-700 hover:bg-teal-50'
                                }`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-xs">movie</span>
                                  <span>Animation</span>
                                </div>
                                <span className="text-[10px] opacity-90 font-mono">۲ فایل</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div
                          onClick={() => handleSelectFolder('f-arc-rhino')}
                          className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                            selectedFolderId === 'f-arc-rhino'
                              ? 'bg-[#00716B] text-white font-bold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs">folder</span>
                            <span className="font-mono text-[11px]">Rhino</span>
                          </div>
                          <span className="text-[10px] opacity-80">۱</span>
                        </div>

                        <div
                          onClick={() => handleSelectFolder('f-arc-lumion')}
                          className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                            selectedFolderId === 'f-arc-lumion'
                              ? 'bg-[#00716B] text-white font-bold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs">folder</span>
                            <span className="font-mono text-[11px]">Lumion</span>
                          </div>
                          <span className="text-[10px] opacity-80">۱</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub 2: Financial & IPC (صورت‌وضعیت‌ها و فایل‌های اکسل) */}
                  <div
                    onClick={() => handleSelectFolder('f-ph1-financial')}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                      selectedFolderId === 'f-ph1-financial'
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-emerald-800 hover:bg-emerald-50 bg-emerald-50/40 border border-emerald-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">table_chart</span>
                      <span className="font-bold">صورت‌وضعیت‌ها (اکسل IPC)</span>
                    </div>
                    <span className="text-[10px] font-mono px-1 rounded bg-white/20">۳ فایل</span>
                  </div>

                  {/* Sub 3: STR (Structure) */}
                  <div
                    onClick={() => handleSelectFolder('f-ph1-str')}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                      selectedFolderId === 'f-ph1-str'
                        ? 'bg-[#00716B] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-amber-500 text-sm">folder</span>
                      <span className="font-mono text-[11px]">PH1-STR (سازه)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">۲ فایل</span>
                  </div>

                  {/* Sub 4: MEC (Mechanical) */}
                  <div
                    onClick={() => handleSelectFolder('f-ph1-mec')}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                      selectedFolderId === 'f-ph1-mec'
                        ? 'bg-[#00716B] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-amber-500 text-sm">folder</span>
                      <span className="font-mono text-[11px]">PH1-MEC (مکانیک)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">۲ فایل</span>
                  </div>

                  {/* Sub 5: ELC (Electrical) */}
                  <div
                    onClick={() => handleSelectFolder('f-ph1-elc')}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                      selectedFolderId === 'f-ph1-elc'
                        ? 'bg-[#00716B] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-amber-500 text-sm">folder</span>
                      <span className="font-mono text-[11px]">PH1-ELC (برق)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">۲ فایل</span>
                  </div>

                  {/* Sub 6: NAVIS (Clash Coordination) */}
                  <div
                    onClick={() => handleSelectFolder('f-ph1-navis')}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer ${
                      selectedFolderId === 'f-ph1-navis'
                        ? 'bg-[#00716B] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-teal-600 text-sm">folder</span>
                      <span className="font-mono text-[11px]">PH1-NAVIS (کلش)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">۱ فایل</span>
                  </div>
                </div>
              )}
            </div>

            {/* Root 4: PHASE 2 (Empty Folder to demonstrate empty state) */}
            <div
              onClick={() => handleSelectFolder('f-ph2')}
              className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                selectedFolderId === 'f-ph2'
                  ? 'bg-[#00716B]/10 text-[#00716B] font-bold border border-[#00716B]/30'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-3"></span>
                <span className="material-symbols-outlined text-slate-400 text-base">folder_off</span>
                <span className="font-mono text-[11px]">XON-0000-XXX-PHASE 2</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                خالی (۰)
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>پروژه فعال CDE:</span>
            <span className="font-mono font-bold text-slate-700">PRJ-1042 (برج آلفا)</span>
          </div>
        </div>

        {/* =========================================================
            LEFT COLUMN: FOLDER CONTENT (SUBFOLDERS + FILES TABLE)
            ========================================================= */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* =========================================================
              NEW SECTION REQUESTED BY USER:
              SUB-FOLDERS IN THE CURRENTLY SELECTED BRANCH
              ========================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00716B] text-xl">folder_copy</span>
                <h3 className="text-sm font-bold text-slate-900">
                  پوشه‌های موجود در شاخه انتخابی ({currentFolder.name})
                </h3>
              </div>

              {parentFolder && (
                <button
                  onClick={() => handleSelectFolder(parentFolder.id)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="بازگشت به شاخه بالاتر"
                >
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>
                  <span>بازگشت به {parentFolder.name}</span>
                </button>
              )}
            </div>

            {subFolders.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {subFolders.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => handleSelectFolder(sub.id)}
                    className="p-3 rounded-xl border border-slate-200/90 hover:border-[#00716B] hover:shadow-sm bg-slate-50/60 hover:bg-teal-50/30 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <span className="w-8 h-8 rounded-lg bg-amber-100/80 text-amber-700 group-hover:bg-[#00716B] group-hover:text-white flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-lg">folder</span>
                      </span>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-[#00716B] text-sm">
                        arrow_forward
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-xs text-slate-900 group-hover:text-[#00716B] transition-colors line-clamp-1">
                        {sub.name}
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                        <span>{sub.badge || 'پوشه فعال'}</span>
                        <span className="font-mono text-slate-600 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                          {sub.filesCount} فایل
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600 text-base">check_circle</span>
                  <span>این شاخه یک پوشه انتهایی (Leaf Folder) است و مستقیماً شامل فایل‌های پروژه می‌باشد.</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">بدون زیرشاخه</span>
              </div>
            )}
          </div>

          {/* =========================================================
              FILES TABLE SECTION (DYNAMICALLY CHANGING WITH FOLDER)
              ========================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
            {/* Header of Content View */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00716B]"></span>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    فایل‌های موجود در پوشه: {currentFolder.name}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5 block" dir="ltr">
                  Path: {currentFolder.path}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTriggerToast('دریافت یکپارچه ZIP', `بسته کامل اسناد پوشه «${currentFolder.name}» آماده بارگیری شد.`, 'success')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
                >
                  <span className="material-symbols-outlined text-base">folder_zip</span>
                  <span>دریافت یکپارچه (ZIP)</span>
                </button>
                <button
                  onClick={onOpenUpload}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-[#00716B] hover:bg-[#005e59] text-white shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">cloud_upload</span>
                  <span>بارگذاری در این پوشه</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-400 text-[11px]">فیلتر فرمت:</span>
                <button
                  onClick={() => setFormatFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    formatFilter === 'all' ? 'bg-[#00716B] text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  همه ({filteredDocs.length})
                </button>
                <button
                  onClick={() => setFormatFilter('RVT')}
                  className={`px-2 py-1 rounded-lg font-mono font-bold transition-all ${
                    formatFilter === 'RVT' ? 'bg-[#00716B] text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  RVT
                </button>
                <button
                  onClick={() => setFormatFilter('IFC')}
                  className={`px-2 py-1 rounded-lg font-mono font-bold transition-all ${
                    formatFilter === 'IFC' ? 'bg-[#00716B] text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  IFC
                </button>
                <button
                  onClick={() => setFormatFilter('DWG')}
                  className={`px-2 py-1 rounded-lg font-mono font-bold transition-all ${
                    formatFilter === 'DWG' ? 'bg-[#00716B] text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  DWG
                </button>
                <button
                  onClick={() => setFormatFilter('XLSX')}
                  className={`px-2 py-1 rounded-lg font-mono font-bold transition-all ${
                    formatFilter === 'XLSX' ? 'bg-emerald-700 text-white shadow-2xs' : 'bg-white text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  XLSX (اکسل)
                </button>
                <button
                  onClick={() => setFormatFilter('PDF')}
                  className={`px-2 py-1 rounded-lg font-mono font-bold transition-all ${
                    formatFilter === 'PDF' ? 'bg-[#00716B] text-white shadow-2xs' : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  PDF
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono text-[11px]">
                  محتوای متغیر بر اساس پوشه
                </span>
              </div>
            </div>

            {/* Document Table (or Empty State) */}
            {filteredDocs.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-3 w-16 text-center">نوع</th>
                      <th className="py-2.5 px-3">عنوان و کد مدرک (ISO 19650)</th>
                      <th className="py-2.5 px-3 text-center">ویرایش</th>
                      <th className="py-2.5 px-3">طراح / پیمانکار</th>
                      <th className="py-2.5 px-3 text-center">وضعیت</th>
                      <th className="py-2.5 px-3 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredDocs.map((doc) => (
                      <tr
                        key={doc.id}
                        onClick={() => {
                          if (doc.format === 'XLSX' && onOpenExcelIpc) {
                            onOpenExcelIpc(doc);
                          } else {
                            onOpenDocumentDossier(doc.id);
                          }
                        }}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                              doc.format === 'RVT'
                                ? 'bg-teal-50 text-[#00716B] border border-teal-200'
                                : doc.format === 'IFC'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : doc.format === 'DWG'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : doc.format === 'XLSX'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {doc.format}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 group-hover:text-[#00716B] transition-colors">
                              {doc.title}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400 mt-0.5" dir="ltr">
                              {doc.isoCode}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                          {doc.revision}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                              {doc.author.split(' ')[1]?.[0] || 'ب'}
                            </div>
                            <span className="text-slate-800">{doc.author}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              doc.status === 'shared' || doc.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : doc.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {doc.statusLabel}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            {doc.format === 'XLSX' ? (
                              <button
                                onClick={() => {
                                  if (onOpenExcelIpc) onOpenExcelIpc(doc);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#107C41] hover:bg-[#0c6334] text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                                title="بررسی قالب اکسل صورت وضعیت"
                              >
                                <span className="material-symbols-outlined text-sm">table_chart</span>
                                <span>بررسی اکسل</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => onOpenDocumentDossier(doc.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-[#00716B] hover:bg-slate-100 transition-colors"
                                title="مشاهده شناسنامه فنی"
                              >
                                <span className="material-symbols-outlined text-base">visibility</span>
                              </button>
                            )}

                            <button
                              onClick={() => onTriggerToast('دانلود فایل مدرک', `فایل ${doc.isoCode} از مخزن دریافت شد.`, 'success')}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="دانلود فایل"
                            >
                              <span className="material-symbols-outlined text-base">download</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* EMPTY FOLDER STATE - As requested by user */
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 shadow-2xs">
                  <span className="material-symbols-outlined text-3xl">folder_off</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  پوشه «{currentFolder.name}» در حال حاضر خالی است
                </h4>
                <p className="text-xs text-slate-500 max-w-md mb-4 leading-relaxed">
                  هیچ سندی در این شاخه بارگذاری نشده است. شما می‌توانید اولین نسخه از فایل‌های طراحی یا اجرایی این بخش را بارگذاری فرمایید.
                </p>
                <button
                  onClick={onOpenUpload}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00716B] hover:bg-[#005e59] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">cloud_upload</span>
                  <span>بارگذاری مدرک در این پوشه</span>
                </button>
              </div>
            )}

            {/* Table Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>نمایش {filteredDocs.length} مدرک در شاخه «{currentFolder.name}»</span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400">حجم کل پوشه: {currentFolder.size || 'متغیر'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
