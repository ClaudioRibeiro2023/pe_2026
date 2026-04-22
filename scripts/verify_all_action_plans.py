#!/usr/bin/env python3
"""
Verificador Completo de Integração: Planos de Ação PE2026

Valida que todos os dados dos planos de ação foram corretamente importados
para o Supabase, incluindo:
- INITs setoriais de todas as áreas
- INITs corporativas vinculadas às áreas
- Metadados dos planos de ação
- Consistência de orçamentos

Uso:
    python scripts/verify_all_action_plans.py
    python scripts/verify_all_action_plans.py --verbose
    python scripts/verify_all_action_plans.py --json
"""

import os
import sys
import json
import argparse
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, asdict

# Cores para terminal
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

@dataclass
class AreaCheck:
    """Resultado de verificação de uma área."""
    area: str
    slug: str
    expected_sectorial: int
    found_sectorial: int
    expected_corp: int
    found_corp: int
    budget_expected: float
    budget_found: float
    errors: List[str]
    
    @property
    def ok(self) -> bool:
        return len(self.errors) == 0

class ActionPlanVerifier:
    """Verificador completo dos planos de ação."""
    
    AREAS = {
        'rh': {'name': 'RH / Pessoas', 'sectorial': 6, 'corp': 5, 'budget': 78000},
        'marketing': {'name': 'Marketing', 'sectorial': 7, 'corp': 5, 'budget': 389000},
        'pd': {'name': 'P&D', 'sectorial': 6, 'corp': 5, 'budget': 129500},
        'operacoes': {'name': 'Operação', 'sectorial': 8, 'corp': 7, 'budget': 47500},
        'cs': {'name': 'CS', 'sectorial': 8, 'corp': 6, 'budget': 46500},
        'comercial': {'name': 'Comercial', 'sectorial': 5, 'corp': 3, 'budget': 53000},
        'financeiro': {'name': 'Financeiro', 'sectorial': 8, 'corp': 5, 'budget': 44500},
    }
    
    CORPORATE_INITS_BY_AREA = {
        'rh': ['INIT-009', 'INIT-010', 'INIT-015', 'INIT-016', 'INIT-022'],
        'marketing': ['INIT-004', 'INIT-007', 'INIT-008', 'INIT-017', 'INIT-018'],
        'pd': ['INIT-003', 'INIT-010', 'INIT-011', 'INIT-014', 'INIT-020'],
        'operacoes': ['INIT-001', 'INIT-005', 'INIT-008', 'INIT-009', 'INIT-015', 'INIT-016', 'INIT-017'],
        'cs': ['INIT-001', 'INIT-002', 'INIT-004', 'INIT-005', 'INIT-011', 'INIT-017'],
        'comercial': ['INIT-021', 'INIT-018', 'INIT-019'],
        'financeiro': ['INIT-006', 'INIT-007', 'INIT-019', 'INIT-012', 'INIT-013'],
    }
    
    SECTORIAL_CODES = {
        'rh': [f'INIT-RH-{i}' for i in range(301, 307)],
        'marketing': [f'INIT-MKT-{i}' for i in range(101, 108)],
        'pd': [f'INIT-PD-{i}' for i in range(251, 257)],
        'operacoes': [f'INIT-OP-{i}' for i in range(151, 159)],
        'cs': [f'INIT-CS-{i}' for i in range(201, 209)],
        'comercial': [f'INIT-COM-{i}' for i in range(401, 406)],
        'financeiro': [f'INIT-FIN-{i}' for i in range(351, 359)],
    }
    
    def __init__(self, verbose: bool = False, json_output: bool = False):
        self.verbose = verbose
        self.json_output = json_output
        self.results: List[AreaCheck] = []
        
    def _check_seed_file(self) -> Tuple[bool, List[str]]:
        """Verifica se os arquivos seed existem."""
        errors = []
        files = [
            'supabase/seeds/07_rh_action_plan_real_data.sql',
            'supabase/seeds/08_all_areas_action_plan_real_data.sql',
        ]
        
        for f in files:
            path = os.path.join(os.getcwd(), f)
            if not os.path.exists(path):
                errors.append(f"Arquivo não encontrado: {f}")
                
        return len(errors) == 0, errors
    
    def _check_area_in_seed(self, area_slug: str) -> Tuple[int, int, float, List[str]]:
        """Verifica uma área nos arquivos seed."""
        errors = []
        found_sectorial = 0
        found_corp = 0
        budget_total = 0.0
        
        # Verifica seed do RH (para RH)
        if area_slug == 'rh':
            seed_path = os.path.join(os.getcwd(), 'supabase/seeds/07_rh_action_plan_real_data.sql')
            if os.path.exists(seed_path):
                with open(seed_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    for code in self.SECTORIAL_CODES[area_slug]:
                        if code in content:
                            found_sectorial += 1
                        else:
                            errors.append(f"INIT setorial não encontrada: {code}")
                            
                    for code in self.CORPORATE_INITS_BY_AREA[area_slug]:
                        if code in content or f"'{code}'" in content:
                            found_corp += 1
        
        # Verifica seed geral (todas as áreas)
        seed_path = os.path.join(os.getcwd(), 'supabase/seeds/08_all_areas_action_plan_real_data.sql')
        if os.path.exists(seed_path):
            with open(seed_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Conta sectoriais
                for code in self.SECTORIAL_CODES[area_slug]:
                    if code in content:
                        found_sectorial += 1
                    else:
                        errors.append(f"INIT setorial não encontrada: {code}")
                
                # Conta corporativas (apenas nas áreas não-RH)
                if area_slug != 'rh':
                    for code in self.CORPORATE_INITS_BY_AREA[area_slug]:
                        if code in content or f"'{code}'" in content:
                            found_corp += 1
                        else:
                            errors.append(f"INIT corporativa não vinculada: {code}")
                
                # Extrai orçamentos (regex simples)
                import re
                area_prefix = code.split('-')[1]  # ex: MKT, PD, OP, etc.
                budget_pattern = rf"'{code}'.*?(\d+\.?\d*),"
                matches = re.findall(budget_pattern, content)
                budget_total = sum(float(m) for m in matches)
        
        return found_sectorial, found_corp, budget_total, errors
    
    def verify_area(self, area_slug: str) -> AreaCheck:
        """Verifica uma área específica."""
        area_info = self.AREAS[area_slug]
        
        found_sec, found_corp, budget, errors = self._check_area_in_seed(area_slug)
        
        # Validações adicionais
        if found_sec != area_info['sectorial']:
            errors.append(f"INITs setoriais: esperado {area_info['sectorial']}, encontrado {found_sec}")
            
        if found_corp < area_info['corp']:
            errors.append(f"INITs corporativas: esperado {area_info['corp']}, encontrado {found_corp}")
        
        # Verifica se budget está na faixa esperada (±20%)
        budget_min = area_info['budget'] * 0.8
        budget_max = area_info['budget'] * 1.2
        if not (budget_min <= budget <= budget_max):
            errors.append(f"Orçamento fora da faixa: R$ {budget:,.0f} (esperado: R$ {area_info['budget']:,.0f})")
        
        return AreaCheck(
            area=area_info['name'],
            slug=area_slug,
            expected_sectorial=area_info['sectorial'],
            found_sectorial=found_sec,
            expected_corp=area_info['corp'],
            found_corp=found_corp,
            budget_expected=area_info['budget'],
            budget_found=budget,
            errors=errors
        )
    
    def run_verification(self) -> bool:
        """Executa verificação completa."""
        # Verifica arquivos seed
        seeds_ok, seed_errors = self._check_seed_file()
        if not seeds_ok:
            if self.json_output:
                print(json.dumps({'status': 'error', 'errors': seed_errors}, indent=2))
            else:
                print(f"{Colors.RED}❌ ERRO: Arquivos seed não encontrados{Colors.END}")
                for e in seed_errors:
                    print(f"  - {e}")
            return False
        
        # Verifica cada área
        all_ok = True
        for slug in self.AREAS.keys():
            result = self.verify_area(slug)
            self.results.append(result)
            if not result.ok:
                all_ok = False
        
        return all_ok
    
    def print_report(self):
        """Imprime relatório de verificação."""
        if self.json_output:
            report = {
                'status': 'ok' if all(r.ok for r in self.results) else 'error',
                'areas': [asdict(r) for r in self.results],
                'summary': {
                    'total_areas': len(self.results),
                    'areas_ok': sum(1 for r in self.results if r.ok),
                    'areas_error': sum(1 for r in self.results if not r.ok),
                    'total_initiatives_sectorial': sum(r.found_sectorial for r in self.results),
                    'total_initiatives_corp': sum(r.found_corp for r in self.results),
                }
            }
            print(json.dumps(report, indent=2, ensure_ascii=False))
            return
        
        # Relatório em texto
        print(f"\n{Colors.BOLD}{'='*70}{Colors.END}")
        print(f"{Colors.BOLD}VERIFICAÇÃO DOS PLANOS DE AÇÃO PE2026{Colors.END}")
        print(f"{Colors.BOLD}{'='*70}{Colors.END}\n")
        
        for result in self.results:
            status = f"{Colors.GREEN}✅{Colors.END}" if result.ok else f"{Colors.RED}❌{Colors.END}"
            print(f"{status} {Colors.BOLD}{result.area}{Colors.END}")
            
            if self.verbose or not result.ok:
                print(f"   INITs Setoriais: {result.found_sectorial}/{result.expected_sectorial}")
                print(f"   INITs Corporativas: {result.found_corp}/{result.expected_corp}")
                print(f"   Orçamento: R$ {result.budget_found:,.0f} (esperado: R$ {result.budget_expected:,.0f})")
                
                if result.errors:
                    for error in result.errors:
                        print(f"   {Colors.RED}⚠️  {error}{Colors.END}")
            
            print()
        
        # Resumo
        total_ok = sum(1 for r in self.results if r.ok)
        total = len(self.results)
        
        print(f"{Colors.BOLD}{'='*70}{Colors.END}")
        print(f"{Colors.BOLD}RESUMO{Colors.END}")
        print(f"{Colors.BOLD}{'='*70}{Colors.END}")
        print(f"Áreas verificadas: {total}")
        print(f"Áreas OK: {Colors.GREEN}{total_ok}{Colors.END}")
        print(f"Áreas com erro: {Colors.RED}{total - total_ok}{Colors.END}")
        print(f"Total INITs setoriais: {sum(r.found_sectorial for r in self.results)}")
        print(f"Total INITs corporativas: {sum(r.found_corp for r in self.results)}")
        print(f"{Colors.BOLD}{'='*70}{Colors.END}\n")
        
        if total_ok == total:
            print(f"{Colors.GREEN}{Colors.BOLD}✓ Todos os planos de ação estão corretamente integrados!{Colors.END}\n")
        else:
            print(f"{Colors.YELLOW}{Colors.BOLD}⚠️  Algumas áreas precisam de atenção.{Colors.END}\n")


def main():
    parser = argparse.ArgumentParser(
        description='Verifica integração dos planos de ação PE2026'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Mostra detalhes de todas as áreas (não apenas erros)'
    )
    parser.add_argument(
        '--json',
        action='store_true',
        help='Saída em formato JSON'
    )
    
    args = parser.parse_args()
    
    verifier = ActionPlanVerifier(verbose=args.verbose, json_output=args.json)
    success = verifier.run_verification()
    verifier.print_report()
    
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
