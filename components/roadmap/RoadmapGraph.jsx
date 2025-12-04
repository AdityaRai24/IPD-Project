"use client";
import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Lock, BookOpen } from 'lucide-react';

// Custom Node Component
const RoadmapNode = ({ data }) => {
  const { label, status, isLocked, type } = data;
  
  const getStatusColor = () => {
    if (isLocked) return "bg-gray-100 border-gray-300";
    if (status === 'completed') return "bg-green-50 border-green-500";
    return "bg-white border-primary";
  };

  const getIcon = () => {
    if (isLocked) return <Lock className="w-4 h-4 text-gray-400" />;
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <BookOpen className="w-4 h-4 text-primary" />;
  };

  return (
    <div className={`px-4 py-3 shadow-md rounded-xl border-2 min-w-[180px] transition-all hover:scale-105 ${getStatusColor()}`}>
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase text-gray-500">{type}</span>
          {getIcon()}
        </div>
        <div className={`font-bold text-sm ${isLocked ? 'text-gray-500' : 'text-gray-800'}`}>
          {label}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
};

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

const RoadmapGraph = ({ roadmap, onNodeClick }) => {
  // Transform roadmap data into nodes and edges
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];
    let yPos = 0;
    const xSpacing = 250;
    const ySpacing = 150;

    roadmap.forEach((unit, unitIndex) => {
      // Unit Node (Center)
      const unitNodeId = `unit-${unitIndex}`;
      nodes.push({
        id: unitNodeId,
        type: 'roadmapNode',
        position: { x: 250, y: yPos },
        data: { 
          label: unit.name, 
          type: 'Unit',
          status: 'active', // Simplified for now
          isLocked: false 
        },
      });

      // Level Nodes (Branching out)
      unit.levels.forEach((level, levelIndex) => {
        const levelNodeId = `level-${unitIndex}-${levelIndex}`;
        // Alternate left and right
        const xPos = levelIndex % 2 === 0 ? 0 : 500;
        const levelYPos = yPos + ySpacing + (Math.floor(levelIndex / 2) * 100);

        nodes.push({
          id: levelNodeId,
          type: 'roadmapNode',
          position: { x: xPos, y: levelYPos },
          data: { 
            label: level.description, 
            type: `Level ${level.level}`,
            status: level.completed ? 'completed' : 'pending',
            isLocked: false, // Logic to be refined
            originalData: level,
            sectionIndex: unitIndex,
            levelIndex: levelIndex
          },
        });

        // Edge from Unit to Level
        edges.push({
          id: `e-${unitNodeId}-${levelNodeId}`,
          source: unitNodeId,
          target: levelNodeId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8' },
        });
      });

      yPos += (Math.ceil(unit.levels.length / 2) * 100) + ySpacing * 2;
    });

    return { nodes, edges };
  }, [roadmap]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = (event, node) => {
    if (node.data.originalData && onNodeClick) {
      onNodeClick(node.data.originalData, node.data.sectionIndex, node.data.levelIndex);
    }
  };

  return (
    <div className="h-[800px] w-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default RoadmapGraph;
