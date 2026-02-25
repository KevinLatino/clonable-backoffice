"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EscrowMilestoneProgressBar,
  EscrowMilestoneProgressDonut,
  useEscrowMilestoneProgress,
} from "@/components/tw-blocks/escrows/indicators/milestone-progress";
import { GetEscrowsFromIndexerResponse as Escrow } from "@trustless-work/escrow/types";
import { MultiReleaseMilestone, SingleReleaseMilestone } from "@trustless-work/escrow";

/**
 * Demo Page for EscrowMilestoneProgress Components
 */

// Mock data generators
const createMultiReleaseMilestone = (
  description: string,
  released: boolean = false,
  approved: boolean = false
): MultiReleaseMilestone => ({
  description,
  receiver: "GBPZXL6K67XRQXZFGX6JYDW73OR4W2GXDW73YSDGKTX7TWWM3AZWVGW",
  amount: 100,
  status: "pending",
  flags: {



  },
});

const createSingleReleaseMilestone = (
  description: string,
  approved: boolean = false
): SingleReleaseMilestone => ({
  description,
  approved,
  status: "pending",
});

// Test scenarios
const SCENARIOS = {
  multiReleaseNone: {
    type: "multi-release",
    milestones: [
      createMultiReleaseMilestone("Milestone 1", false, true),
      createMultiReleaseMilestone("Milestone 2", false, true),
      createMultiReleaseMilestone("Milestone 3", false, true),
    ] as MultiReleaseMilestone[],
    description: "Multi-Release: 0 released, 3 approved",
  },
  multiReleasePartial: {
    type: "multi-release",
    milestones: [
      createMultiReleaseMilestone("Milestone 1", true, true),
      createMultiReleaseMilestone("Milestone 2", true, true),
      createMultiReleaseMilestone("Milestone 3", false, true),
      createMultiReleaseMilestone("Milestone 4", false, true),
    ] as MultiReleaseMilestone[],
    description: "Multi-Release: 2 de 4 liberados (50%)",
  },
  multiRelease100: {
    type: "multi-release",
    milestones: [
      createMultiReleaseMilestone("Milestone 1", true, true),
      createMultiReleaseMilestone("Milestone 2", true, true),
      createMultiReleaseMilestone("Milestone 3", true, true),
    ] as MultiReleaseMilestone[],
    description: "Multi-Release: 3 de 3 liberados (100%)",
  },
  singleReleasePartial: {
    type: "single-release",
    milestones: [
      createSingleReleaseMilestone("Milestone 1", true),
      createSingleReleaseMilestone("Milestone 2", true),
      createSingleReleaseMilestone("Milestone 3", false),
    ] as SingleReleaseMilestone[],
    description: "Single-Release: 2 de 3 aprobados",
  },
  singleRelease100: {
    type: "single-release",
    milestones: [
      createSingleReleaseMilestone("Milestone 1", true),
      createSingleReleaseMilestone("Milestone 2", true),
    ] as SingleReleaseMilestone[],
    description: "Single-Release: 2 de 2 aprobados (100%)",
  },
  empty: {
    type: "multi-release",
    milestones: [] as MultiReleaseMilestone[],
    description: "Vacío: Sin milestones",
  },
};

type ScenarioKey = keyof typeof SCENARIOS;

export default function MilestoneProgressDemo() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>("multiReleasePartial");

  const scenario = SCENARIOS[selectedScenario];
  const mockEscrow = {
    ...({} as Escrow),
    type: scenario.type as "single-release" | "multi-release",
    milestones: scenario.milestones,
  };

  const approvedProgress = useEscrowMilestoneProgress(mockEscrow, "approved");
  const releasedProgress = useEscrowMilestoneProgress(mockEscrow, "released");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">🎯 EscrowMilestoneProgress Demo</h1>
          <p className="text-muted-foreground text-lg">
           {/* Please eat shit */}
          </p>
        </div>

        {/* Scenario Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Selecciona un Escenario</CardTitle>
            <CardDescription>
              Prueba diferentes configuraciones de escrows y hitos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(Object.entries(SCENARIOS) as [ScenarioKey, typeof SCENARIOS[ScenarioKey]][]).map(
                ([key, { description }]) => (
                  <Button
                    key={key}
                    variant={selectedScenario === key ? "default" : "outline"}
                    className="h-auto p-3 text-left justify-start"
                    onClick={() => setSelectedScenario(key)}
                  >
                    <div>
                      <div className="font-medium">{key}</div>
                      <div className="text-xs text-muted-foreground">{description}</div>
                    </div>
                  </Button>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Scenario Info */}
        <Card className="border-2 border-primary/50">
          <CardHeader>
            <CardTitle>Escenario Actual: {scenario.description}</CardTitle>
            <CardDescription>
              Tipo: <span className="font-mono font-semibold">{scenario.type}</span> | Hitos:{" "}
              <span className="font-mono font-semibold">{scenario.milestones.length}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Approved Progress */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-semibold mb-2">📊 Aprobados</div>
              <div className="text-sm text-muted-foreground mb-3">
                <span className="font-mono">{approvedProgress.completedMilestones}</span> de{" "}
                <span className="font-mono">{approvedProgress.totalMilestones}</span> (
                <span className="font-mono font-bold text-foreground">
                  {approvedProgress.percentage}%
                </span>
                )
              </div>
              {!approvedProgress.isValid && (
                <div className="text-sm text-red-600 font-semibold">
                  ⚠️ {approvedProgress.errorMessage}
                </div>
              )}
            </div>

            {/* Released Progress */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-semibold mb-2">🚀 Liberados</div>
              <div className="text-sm text-muted-foreground mb-3">
                <span className="font-mono">{releasedProgress.completedMilestones}</span> de{" "}
                <span className="font-mono">{releasedProgress.totalMilestones}</span> (
                <span className="font-mono font-bold text-foreground">
                  {releasedProgress.percentage}%
                </span>
                )
              </div>
              {!releasedProgress.isValid && (
                <div className="text-sm text-yellow-600 font-semibold">
                  ℹ️ {releasedProgress.errorMessage}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Components Demo */}
        <Tabs defaultValue="bars" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bars">Barras</TabsTrigger>
            <TabsTrigger value="donuts">Donuts</TabsTrigger>
            <TabsTrigger value="combined">Combinado</TabsTrigger>
          </TabsList>

          {/* Bars Demo */}
          <TabsContent value="bars" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Approved Bar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Barra: Aprobados</CardTitle>
                  <CardDescription>
                    Modo "approved" - Funciona con ambos tipos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <EscrowMilestoneProgressBar
                    escrow={mockEscrow}
                    mode="approved"
                    showText={true}
                  />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>✅ Con texto indicador</p>
                    <p>✅ Porcentaje dinámico</p>
                    <p>✅ Sin errores</p>
                  </div>
                </CardContent>
              </Card>

              {/* Released Bar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Barra: Liberados</CardTitle>
                  <CardDescription>
                    Modo "released" - Solo multi-release
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <EscrowMilestoneProgressBar
                    escrow={mockEscrow}
                    mode="released"
                    showText={true}
                  />
                  <div className="text-xs text-muted-foreground space-y-1">
                    {releasedProgress.isValid ? (
                      <>
                        <p>✅ Modo válido para este escrow</p>
                        <p>✅ Progreso calculado correctamente</p>
                      </>
                    ) : (
                      <>
                        <p>⚠️ Modo no válido para single-release</p>
                        <p>⚠️ Muestra advertencia clara al usuario</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bar sin texto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Barra sin Texto</CardTitle>
                <CardDescription>Opción showText={false}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-3">Aprobados:</p>
                  <EscrowMilestoneProgressBar
                    escrow={mockEscrow}
                    mode="approved"
                    showText={false}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-3">Liberados:</p>
                  <EscrowMilestoneProgressBar
                    escrow={mockEscrow}
                    mode="released"
                    showText={false}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donuts Demo */}
          <TabsContent value="donuts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Approved Donut */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Donut: Aprobados</CardTitle>
                  <CardDescription>Modo "approved"</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <EscrowMilestoneProgressDonut
                    escrow={mockEscrow}
                    mode="approved"
                    showText={true}
                  />
                </CardContent>
              </Card>

              {/* Released Donut */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Donut: Liberados</CardTitle>
                  <CardDescription>Modo "released"</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <EscrowMilestoneProgressDonut
                    escrow={mockEscrow}
                    mode="released"
                    showText={true}
                  />
                </CardContent>
              </Card>

              {/* Donut sin texto */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Donut: Compacto</CardTitle>
                  <CardDescription>showText={false}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <EscrowMilestoneProgressDonut
                    escrow={mockEscrow}
                    mode="approved"
                    showText={false}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Combined Demo */}
          <TabsContent value="combined" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vista Combinada: Barra + Donut</CardTitle>
                <CardDescription>
                  Cómo se vería en una dashboard real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Bars */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">📊 Progreso en Barras</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Aprobados</label>
                          <div className="mt-2">
                            <EscrowMilestoneProgressBar
                              escrow={mockEscrow}
                              mode="approved"
                              showText={true}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Liberados</label>
                          <div className="mt-2">
                            <EscrowMilestoneProgressBar
                              escrow={mockEscrow}
                              mode="released"
                              showText={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Donuts */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">🎯 Progreso Circular</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-center">
                          <EscrowMilestoneProgressDonut
                            escrow={mockEscrow}
                            mode="approved"
                          />
                        </div>
                        <div className="flex justify-center">
                          <EscrowMilestoneProgressDonut
                            escrow={mockEscrow}
                            mode="released"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsive Test */}
            <Card>
              <CardHeader>
                <CardTitle>Prueba Responsiva</CardTitle>
                <CardDescription>
                  Redimensiona la ventana para ver cómo se adapta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">En móvil (sin texto):</p>
                    <div className="max-w-sm">
                      <EscrowMilestoneProgressBar
                        escrow={mockEscrow}
                        mode="approved"
                        showText={false}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">
                      En escritorio (con texto):
                    </p>
                    <EscrowMilestoneProgressBar
                      escrow={mockEscrow}
                      mode="approved"
                      showText={true}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Test Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>✅ Checklist de Pruebas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="font-semibold text-sm">Funcional:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>☐ Porcentajes correctos en todos los escenarios</li>
                  <li>☐ Contador de hitos exacto</li>
                  <li>☐ Validación de modo vs tipo de escrow</li>
                  <li>☐ Manejo de casos vacíos</li>
                  <li>☐ Animaciones suaves</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-sm">Visual:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>☐ Colores dinámicos según progreso</li>
                  <li>☐ Sincronización barras y donuts</li>
                  <li>☐ Dark mode colors legibles</li>
                  <li>☐ Layout responsivo</li>
                  <li>☐ Texto visible y clara</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
