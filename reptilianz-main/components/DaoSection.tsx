import React, { useState } from 'react';
import GlitchText from './GlitchText';
import VariationSwitcher from './VariationSwitcher';
import { DaoProposal } from '../types';
import { DaoIcon } from './Icons';

const mockProposals: DaoProposal[] = [
    { id: 1, title: 'Allocate treasury to commission new artist', status: 'Active', description: 'Proposal to use 5% of treasury funds to bring a new pixel artist on board for a special collection.', votesFor: 1234, votesAgainst: 210 },
    { id: 2, title: 'Next community contest theme: Glitch City', status: 'Passed', description: 'The community will vote on the next art/lore contest theme. This proposal suggests "Glitch City".', votesFor: 4890, votesAgainst: 543 },
    { id: 3, title: 'Integrate a new marketplace', status: 'Failed', description: 'A proposal to pursue official listing on a secondary marketplace.', votesFor: 850, votesAgainst: 1100 },
];

const getStatusStyles = (status: DaoProposal['status']) => {
    switch (status) {
        case 'Active': return 'border-cyan-400 text-cyan-300';
        case 'Passed': return 'border-lime-400 text-lime-300';
        case 'Failed': return 'border-red-500 text-red-400';
    }
}

const ProposalCard: React.FC<{ proposal: DaoProposal }> = ({ proposal }) => {
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
    const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
    
    return (
        <div className={`p-4 border-2 ${getStatusStyles(proposal.status)} bg-black/30`}>
            <div className="flex justify-between items-start">
                <h3 className="font-display text-xl mb-2">{proposal.title}</h3>
                <span className={`font-display text-sm px-2 py-1 border ${getStatusStyles(proposal.status)}`}>{proposal.status}</span>
            </div>
            <p className="text-gray-400 mb-4">{proposal.description}</p>
            <div className="space-y-2">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-lime-400 font-bold">YAE</span>
                        <span className="text-gray-500">{proposal.votesFor} Votes</span>
                    </div>
                    <div className="w-full bg-gray-700 h-4 border border-black"><div className="bg-lime-500 h-full" style={{width: `${forPercentage}%`}}></div></div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-400 font-bold">NAY</span>
                         <span className="text-gray-500">{proposal.votesAgainst} Votes</span>
                    </div>
                    <div className="w-full bg-gray-700 h-4 border border-black"><div className="bg-red-600 h-full" style={{width: `${againstPercentage}%`}}></div></div>
                </div>
            </div>
            {proposal.status === 'Active' && (
                <div className="flex gap-4 mt-4">
                    <button className="font-display w-full p-2 bg-lime-800 hover:bg-lime-700 text-lime-200">VOTE YAE</button>
                    <button className="font-display w-full p-2 bg-red-800 hover:bg-red-700 text-red-200">VOTE NAY</button>
                </div>
            )}
        </div>
    );
};

const DaoContent: React.FC<{ variation: number }> = ({ variation }) => {
     const [activeTab, setActiveTab] = useState<'Active' | 'Passed' | 'Failed'>('Active');
     const filteredProposals = mockProposals.filter(p => p.status === activeTab);

    switch (variation) {
        case 2: // Government Terminal
            return (
                <div className="bg-black/50 border-2 border-cyan-800 p-4 font-mono text-cyan-400">
                    <p>&gt; SURVIVORS_COUNCIL.GOV</p>
                    <p>&gt; AUTHENTICATING... ACCESS GRANTED.</p>
                    {mockProposals.map(p => (
                        <div key={p.id} className="mt-2">
                            <p>&gt; PROPOSAL #{p.id} [{p.status.toUpperCase()}]</p>
                            <p className="text-white pl-4">{p.title}</p>
                        </div>
                    ))}
                     <p>&gt; <span className="animate-ping">_</span></p>
                </div>
            );
        case 3: // Tabbed Interface
            return (
                <div>
                    <div className="flex border-b-2 border-cyan-800 mb-4">
                        {(['Active', 'Passed', 'Failed'] as const).map(tab => (
                             <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`font-display text-xl px-6 py-2 transition-all duration-200 ${
                                    activeTab === tab 
                                    ? 'bg-cyan-500/20 text-cyan-300 border-b-4 border-cyan-400' 
                                    : 'text-gray-500 hover:bg-cyan-500/10'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col gap-6">{filteredProposals.map(p => <ProposalCard key={p.id} proposal={p}/>)}</div>
                </div>
            );
        case 4: // Forum Style
            return (
                <div className="border-2 border-cyan-900 bg-black/30">
                     <div className="p-2 bg-cyan-900/50 font-display text-cyan-300 grid grid-cols-4"><span className="col-span-2">THREAD / TOPIC</span><span>STATUS</span><span>VOTES</span></div>
                     {mockProposals.map(p => (
                         <div key={p.id} className="grid grid-cols-4 p-2 border-t border-cyan-900 items-center hover:bg-cyan-500/10">
                             <p className="col-span-2 text-white font-bold">{p.title}</p>
                             <p className={`${getStatusStyles(p.status)}`}>{p.status}</p>
                             <p className="text-white">{p.votesFor + p.votesAgainst}</p>
                         </div>
                     ))}
                </div>
            );
        case 5: // Minimalist, Icon focus
            return (
                <div className="text-center">
                    <DaoIcon className="w-32 h-32 text-cyan-400 mx-auto mb-8 animate-pulse" />
                    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                        {mockProposals.filter(p=>p.status === "Active").map(p => <ProposalCard key={p.id} proposal={p}/>)}
                    </div>
                </div>
            );
        case 1: // Original Bulletin Board
        default:
            return (
                 <div className="flex flex-col gap-6">
                    {mockProposals.map(p => <ProposalCard key={p.id} proposal={p}/>)}
                </div>
            );
    }
};

const DaoSection: React.FC<{ id: string }> = ({ id }) => {
    const [variation, setVariation] = useState(1);
    
    return (
        <section id={id} className="py-20 md:py-32 border-t-2 border-cyan-500/30 relative">
            <VariationSwitcher variation={variation} setVariation={setVariation} />
            <h2 className="text-4xl md:text-5xl font-display text-center mb-16">
                <GlitchText className="text-cyan-400 text-shadow-neon-cyan">
                    The Survivors' Council
                </GlitchText>
            </h2>
            <DaoContent variation={variation} />
        </section>
    );
};

export default DaoSection;
